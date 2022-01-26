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

function hourlyCheck() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheets = ss.getSheets()
  const headlan = headerObj[lan]

  const policyrequests = [] 

  sheets.forEach(sheet => {
    const [head, ...data] = sheet.getDataRange().getValues()
    data.forEach((row, i) => {
      if (typeof row[head.indexOf(headlan.freqValue1)] == 'object') {
        row[head.indexOf(headlan.freqValue2)] = row[head.indexOf(headlan.freqValue1)].getHours()
      }
      if (typeof row[head.indexOf(headlan.freqValue2)] == 'object') {
        row[head.indexOf(headlan.freqValue2)] = row[head.indexOf(headlan.freqValue2)].getHours()
      }
      row.unshift(i)
    })
    const activeData = data.filter(row => row[head.indexOf(headlan.active) + 1])
    console.log(activeData)
    activeData.forEach(row => {
      const nxt = nextTrigger(row[head.indexOf(headlan.freqUnit) + 1], row[head.indexOf(headlan.freqValue1) + 1], row[head.indexOf(headlan.freqValue2) + 1], row[head.indexOf(headlan.lastUpdate) + 1])


      const runrow = !nxt ? true : nxt.getTime() <= new Date().getTime() - 2000

      if (runrow) {
        let orgids = row[head.indexOf(headlan.orgIds) + 1]
        let schema = row[head.indexOf(headlan.policyName) + 1]
        let value = JSON.parse(row[head.indexOf(headlan.policyValue) + 1])
        console.log(orgids)
        if (orgids) {
          orgids = orgids.split(',').map(id => id.trim())
          const policy = { orgids: orgids, schema: schema, value: value }
          policyrequests.push(policy)
          sheet.getRange(row[0] + 2, head.indexOf(headlan.lastUpdate) + 1).setValue(new Date())
        }
      }
    })

    const res = setMixedPolicies(policyrequests)
    const isEmpty = Object.keys(res).length === 0;
    if (!isEmpty) {
      console.log(res)
    } else {

    }

  })
}

function editListener(e) {
  try {

    const headlan = headerObj[lan]
    const sheet = e.range.getSheet()
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues().flat()
    const head = headers[e.range.getColumnIndex() - 1]

    if (head == headlan.policyType) {
      processingToast()
      const valueCol = headers.indexOf(headlan.policyName) + 1
      if (!e.value) {
        sheet.getRange(e.range.getRowIndex(), valueCol).clear()
        return
      }
      setPolicyDropDown(e.value)
      SpreadsheetApp.flush()
      return
    }

    if (head == headlan.policyName) {
      processingToast()
      const valueCol = headers.indexOf(headlan.policyValue) + 1
      if (!e.value) {
        sheet.getRange(e.range.getRowIndex(), valueCol).clear()
        return
      }
      const policy = getPolicy(`customers/my_customer/policySchemas/${e.value}`)
      console.log(JSON.stringify(policy))
      const obj = {}
      policy.definition.messageType.forEach(message => {
        obj[message.name] = message.field
      })
      const enumerators = {}

      if (policy.definition.enumType) {
        policy.definition.enumType.forEach(num => {
          enumerators[num.name] = num.value.map(v => v.name)
        })
      }
      console.log(policy.definition.messageType[0].field)
      // console.log({ ...obj, ...enumerators })
      const msg = messageType(policy.definition.messageType[0].field, { ...obj, ...enumerators })
      sheet.getRange(e.range.getRowIndex(), valueCol).setValue(JSON.stringify(msg))
      SpreadsheetApp.flush()
      let orgids = sheet.getRange(e.range.getRowIndex(), headers.indexOf(headlan.orgIds) + 1).getValue()
      let oldpolicy = ''

      if (orgids) {
        orgids = orgids.split(',').map(id => id.trim())
        orgids.forEach(orgid => {
          const pol = getPolicyByOrg(e.value, orgid)
          if (pol && pol.resolvedPolicies && pol.resolvedPolicies.length > 0) {
            oldpolicy += JSON.stringify(pol.resolvedPolicies[0].value.value)
          }
          //oldpolicy += JSON.stringify(getPolicyByOrg(e.value, orgid))
        })
        if (oldpolicy && oldpolicy != '') {
          sheet.getRange(e.range.getRowIndex(), valueCol).setNote(oldpolicy)
        } else {
          sheet.getRange(e.range.getRowIndex(), valueCol).clearNote()
        }
      } else {
        sheet.getRange(e.range.getRowIndex(), valueCol).clearNote()
      }
    }

    if (head == headlan.policyName || head == headlan.orgPaths || head == headlan.policyValue) {
      processingToast()
      createGamCommands(sheet, e.range.getRowIndex())
    }



    if (head == headlan.freqUnit) {
      processingToast()
      const valueCol1 = headers.indexOf(headlan.freqValue1) + 1
      const valueCol2 = headers.indexOf(headlan.freqValue2) + 1
      const range1 = sheet.getRange(e.range.getRowIndex(), valueCol1)
      const range2 = sheet.getRange(e.range.getRowIndex(), valueCol2)
      range1.clear()
      range2.clear()
      range1.setDataValidation(null)
      range2.setDataValidation(null)
      if (!e.value) {
        sheet.getRange(e.range.getRowIndex(), valueCol1).clear()
        sheet.getRange(e.range.getRowIndex(), valueCol2).clear()
        return
      }
      const unitsArray = object.values(units[lan])
      unitsArray.indexOf(e.value)
      if (unitsArray.indexOf(e.value) < 4) {
        setDropdown(units[lan][e.value], range1)
      }
      if (unitsArray.indexOf(e.value) == 4) {
        setDropdown(units[lan][e.value], range2)
      }
    }

    if (head == headlan.freqValue1) {
      processingToast()
      const valueCol1 = headers.indexOf(headlan.freqValue1) + 1
      const valueCol2 = headers.indexOf(headlan.freqValue2) + 1
      const range1 = sheet.getRange(e.range.getRowIndex(), valueCol1)
      const range2 = sheet.getRange(e.range.getRowIndex(), valueCol2)

      if (unitsArray.indexOf(range1.getValue()) >= 2 && unitsArray.indexOf(range1.getValue()) <= 3) {
        setDropdown(units[lan]['Daily'], range2)
      } else {
        range2.setValue('n/a')
      }

    }
  } catch (e) {
    console.log('onEdit error', e)
  }

}

function test_nextTrigger() {
  const lastRun = ''
  const test1 = { unit: 'Hourly', value1: 2, value2: '' }
  console.log('Hourly', nextTrigger(test1.unit, test1.value1, test1.value2, lastRun))
  const test2 = { unit: 'Daily', value1: 15, value2: '' }
  console.log('Daily', nextTrigger(test2.unit, test2.value1, test2.value2, lastRun))
  const test3 = { unit: 'Weekly', value1: 'Monday', value2: '7PM' }
  console.log('Weekly', nextTrigger(test3.unit, test3.value1, test3.value2, lastRun))
  const test4 = { unit: 'Monthly', value1: 10, value2: '6am' }
  console.log('Monthly', nextTrigger(test4.unit, test4.value1, test4.value2, lastRun))
  const test5 = { unit: 'Specific Date', value1: '1/22/22', value2: '4pm' }
  console.log('Specific Date', nextTrigger(test5.unit, test5.value1, test5.value2, lastRun))

}


function nextTrigger(unit, value1, value2, lastRun) {
  if (!lastRun) {
    return null
  } else {
    lastRun = new Date(lastRun)
  }
  let nextTime

  switch (unit) {
    case freq[lan].hourly:
      nextTime = nextHour(lastRun, value1)
      break;
    case freq[lan].daily:
      nextTime = nextDay(lastRun, value1)
      break;
    case freq[lan].weekly:
      nextTime = nextWeek(lastRun, value1, value2)
      break;
    case freq[lan].monthly:
      nextTime = nextMonth(lastRun, value1, value2)
      break;
    case freq[lan].specific:
      nextTime = onDate(value1, value2)
      break;
  }
  return nextTime
}

function nextHour(last, value) {
  return new Date(last.setHours(last.getHours() + value))
}

function nextDay(last, value) {
  const num = timeNumber(value)
  last.setDate(last.getDate() + 1)
  return new Date(last.setHours(num))
}

function nextWeek(last, value1, value2) {
  const daysOfWeek = units[lan]['Weekly']
  const dayNum = daysOfWeek.indexOf(value1)
  const num = timeNumber(value2)

  const lastDay = last.getDay()
  let adjust = 0
  if (lastDay >= dayNum) {
    adjust = 7 - (lastDay - dayNum)
  } else {
    adjust = dayNum - lastDay
  }
  last.setDate(last.getDate() + adjust)
  return new Date(last.setHours(num))
}

function nextMonth(last, value1, value2) {
  const num = timeNumber(value2)
  last.setMonth(last.getMonth() + 1)
  last.setDate(value1)
  return (new Date(last.setHours(num)))
}

function onDate(value1, value) {
  const num = timeNumber(value)
  return new Date(new Date(value1).setHours(num))
}

function timeNumber(value) {
  value = value ? value : `12${timeSuffix[lan].defaultSuffix}`
  let num = value
  if (typeof value == 'string') {
    num = parseInt(value)
    const regexstr = timeSuffix[lan].regex
    const regex = new RegExp(regexstr, 'gi')
    let ampm = value.match(regex)
    if (ampm) {
      ampm = ampm[0].toLowerCase()
      if (ampm == timeSuffix[lan].am && num == 12) {
        num = 0
      }
      else if (ampm == timeSuffix[lan].pm) {
        num += 12
      }
    }
  }
  return num
}

