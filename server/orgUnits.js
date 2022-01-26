
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

function sampleData() {
  return  [{ name: '/', orgUnitPath: '/', level: 0, expandable: true },
  {
    name: 'Meet Test',
    orgUnitPath: '/Meet Test',
    parentOrgUnitPath: '/',
    level: 1,
    expandable: true
  },
  {
    name: 'Students',
    orgUnitPath: '/Meet Test/Students',
    parentOrgUnitPath: '/Meet Test',
    level: 2,
    expandable: true
  },
  {
    name: 'Staff',
    orgUnitPath: '/Meet Test/Staff',
    parentOrgUnitPath: '/Meet Test',
    level: 2,
    expandable: true
  },

  {
    name: 'Drive Storage',
    orgUnitPath: '/Drive Storage',
    parentOrgUnitPath: '/',
    level: 1,
    expandable: true
  },
  {
    name: 'Students',
    orgUnitPath: '/Drive Storage/Students',
    parentOrgUnitPath: '/Drive Storage',
    level: 2,
    expandable: true
  },
  {
    name: 'Staff',
    orgUnitPath: '/Drive Storage/Staff',
    parentOrgUnitPath: '/Drive Storage',
    level: 2,
    expandable: true
  },
  ]
}


function nestOrgs(org = '/', orgUnitId='/') {
  
  const orgs = listOrgs(org).map(o=>{return {name:o.name, orgUnitId:o.orgUnitId.split(':')[1], orgUnitPath:o.orgUnitPath, parentOrgUnitPath:o.parentOrgUnitPath}})
  orgs.push({ name: org ,orgUnitPath: org, orgUnitId: orgUnitId})
  const idMapping = orgs.reduce((acc, el, i) => {
      acc[el.orgUnitPath] = i;
      return acc;
  }, {});

  let root;
  orgs.forEach(el => {
      if (el.orgUnitPath === org) {
          root = el;
          return;
      }
      const parentEl = orgs[idMapping[el.parentOrgUnitPath]];
      parentEl.children = [...(parentEl.children || []), el];
  });

  return [root]
}


function listOrgs(org) {
  const args = {
      orgUnitPath: org,
      type: 'ALL'
  }
  return AdminDirectory.Orgunits.list('my_customer', args).organizationUnits
}