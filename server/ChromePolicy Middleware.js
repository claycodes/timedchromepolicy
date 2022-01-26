// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

function test_getPolicy() {
  const getPolictInfo = getPolicyInfo('SessionLength') //common name used 
  const res = getPolicy(getPolictInfo.name)
  console.log(res)
}

function getPolicy(policySchemaName) {
  const chromepolicy = Discovery.discover('chromepolicy', 'v1')
  const path = { name: policySchemaName }
  return chromepolicy.customers.policySchemas.get(path)
}

function test_getPolicyByOrg() {
  const org = testOrgId
  const res = getPolicyByOrg('chrome.users.SessionLength', org)
  console.log(res)
}

function getPolicyByOrg(policySchemaName, orgunitId) {
  const chromepolicy = Discovery.discover('chromepolicy', 'v1')
  const policyData = {
    'policySchemaFilter': policySchemaName,
    'policyTargetKey': {
      'targetResource': `orgunits/${orgunitId}`
    }
  };
  const result = chromepolicy.customers.policies.resolve({ customer: 'customers/my_customer' }, {}, policyData)
  return result
}

function test_setPolicies() {
  const orgids = [testOrgId] 
  const getPolictInfo = getPolicyInfo('SessionLength')
  const policies = [{ schema: getPolictInfo.schemaName, value: { sessionDurationLimit: { duration: "60s" } } }]
  const res = setPolicies(orgids, policies)
  console.log(res)
}
//[{orgids:[],schema:'',value:''}]

function setMixedPolicies(policyrequests){
  const newPolicies=[]
  policyrequests.forEach(pol=>{
    const orgpolicies = pol.orgids.map(org => {
      const mask = Object.keys(pol.value).join(',')
      const policyUpdate = {
        policyTargetKey: {
          targetResource: `orgunits/${org}`
        },
        policyValue: {
          policySchema: pol.schema,
          value: pol.value
        },
        updateMask: mask
      }
      return policyUpdate
    })
    newPolicies.push(orgpolicies)
  })

  const res=[]
  //ensures 50mb post limit
  while (newPolicies && newPolicies.length > 0) {
    const slicedPolocies = newPolicies.splice(0, 200000)
    const response = batchModify(slicedPolocies)
    res.push(response)
  }
  if(res.length==1){
    return res[0]
  }
  return res
}

function setPolicies(orgids, policies) {
  const newPolicies = []
  policies.forEach(policy => {
    const mask = Object.keys(policy.value).join(',')
    const orgpolicies = orgids.map(org => {
      const policyUpdate = {
        policyTargetKey: {
          targetResource: `orgunits/${org}`
        },
        policyValue: {
          policySchema: policy.schema,
          value: policy.value
        },
        updateMask: mask
      }
      return policyUpdate
    })
    newPolicies.push(...orgpolicies)
  })
  const res=[]
  //ensures 50mb post limit
  while (newPolicies && newPolicies.length > 0) {
    const slicedPolocies = newPolicies.splice(0, 200000)
    const response = batchModify(slicedPolocies)
    res.push(response)
  }
  if(res.length==1){
    return res[0]
  }
  return res
}

function getAllPolicies() {
  const chromepolicy = Discovery.discover('chromepolicy')
  const params = {}
  const policies = []
  do {
    const policy = chromepolicy.customers.policySchemas.list({ 'parent': 'customers/my_customer' }, params)
    params.pageToken = policy.nextPageToken
    if (policy.policySchemas && policy.policySchemas.length > 0) {
      policies.push(...policy.policySchemas)
    }
  } while (params.pageToken)

  return policies
}

function policyList(){
  const policies = getAllPolicies()
  const names = policies.map(policy=>policy.schemaName)
  return names
}

function test_getPolicyInfo(){
  const getPolictInfo = getPolicyInfo('SessionLength')
  console.log(getPolictInfo)
}

function getPolicyInfo(name, type) {
  name = name.toLowerCase()
  setPolicyProperties()
  const properties = PropertiesService.getScriptProperties()
  let prop = properties.getProperty(name)
  if (!prop) {
    return
  }
  prop = JSON.parse(prop)
  if (type && prop.policyCount > 1) {
    type = type.toLowerCase()
    const filtered = prop.policies.filter(p => p.schemaName.includes(type))
    return filtered[0]
  } else {
    return prop.policies[0]
  }

}

function setPolicyProperties(override=true) {
  const properties = PropertiesService.getScriptProperties()
  const cache=CacheService.getScriptCache()
  const cacheset = cache.get('set')=='true'?true:false
  //cache and property fallback are used to prevent over calling of the property service. Override is for manual or timed updates of properties list.
  if(cacheset && !override){
    return
  }
  const propset = properties.getProperty('set')=='true'?true:false
  if(propset&& !override){
    cache.put('set','true')
    return
  }
  const policies = getAllPolicies()
 
  const policyObject = {}

  policies.forEach(pol => {
    const arr = pol.schemaName.split('.')
    const name = arr[arr.length - 1].toLowerCase()
    const pols = policies.filter(pol => pol.schemaName.includes(name))
    
    if (pols.length > 1) {
      pols.forEach(p=>{delete p.policyApiLifeycle; delete pol.supportUri;})
      policyObject[name] = JSON.stringify({ policies: pols, policyCount: pols.length })
    } else {
      delete pol.policyApiLifeycle
      delete pol.supportUri
      policyObject[name] = JSON.stringify({ policies: [pol], policyCount: 1 })
    }
  })

  const blob = Utilities.newBlob(JSON.stringify(policyObject)).getBytes().length
  const former = properties.getProperties()
  const pastProperties = former ? former : []
  properties.setProperty('set', 'true')

  properties.setProperties({ ...pastProperties, ...policyObject })
}

function batchModify(requests) {
  const chromepolicy = Discovery.discover('chromepolicy')
  return chromepolicy.customers.policies.orgunits.batchModify({ customer: 'customers/my_customer' }, {}, {
    requests: requests
  })
}
