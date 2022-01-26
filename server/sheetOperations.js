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

function setHeader() {
  const headlan = headerObj[lan]
  const headlang = Object.values(headlan)
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getActiveSheet()
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn() | 1).getValues().flat()
  headlang.forEach(h => {
    if (!headers.includes(h)) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(h)
    }
  })
  sheet.setFrozenRows(1)
}

function setActiveCheckbox() {
  SpreadsheetApp.flush()
  const headlan = headerObj[lan]
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getActiveSheet()
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues().flat()
  const rows = Math.min(sheet.getMaxRows(), 499)

  const range = sheet.getRange(2, headers.indexOf(headlan.active) + 1, rows, 1)

  range.insertCheckboxes();
}

function setUnitDropDown() {

  const headlan = headerObj[lan]

  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getActiveSheet()
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues().flat()
  const range = sheet.getRange(2, headers.indexOf(headlan.freqUnit) + 1, sheet.getMaxRows(), 1)
  setDropdown(Object.values(freq[lan]), range)
}

function setPolicyCategory() {
  const list = policyList()
  const newList = list.map(policy => {
    policy = policy.split('.')
    policy.splice(-1, 1)
    return policy.join('.')
  })
  const setList = [...new Set(newList)]

  const headlan = headerObj[lan]
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getActiveSheet()
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues().flat()
  const range = sheet.getRange(2, headers.indexOf(headlan.policyType) + 1, sheet.getMaxRows(), 1)

  setDropdown(setList, range)
}

function setPolicyDropDown(category = 'chrome.users') {
  const categoryLength = category.split('.').length
  const headlan = headerObj[lan]
  const list = policyList().filter(item => item.includes(category) && item.split('.').length==categoryLength+1)
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getActiveSheet()
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues().flat()
  const range = sheet.getRange(2, headers.indexOf(headlan.policyName) + 1, sheet.getMaxRows(), 1)

  setDropdown(list.slice(0, 500), range)
}

function processingToast() {
  SpreadsheetApp.getActiveSpreadsheet().toast(messages[lan].processing);
}

function insertOrgIds(orgids) {

  const headlan = headerObj[lan]
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getActiveSheet()
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues().flat()

  const lastRow = lastEmptyRow(sheet)
  const range = sheet.getRange(lastRow, headers.indexOf(headlan.orgIds) + 1)
  const range1 = sheet.getRange(lastRow, headers.indexOf(headlan.orgPaths) + 1)
  range.setValue(orgids.map(a => a.id).join(', '))
  range1.setValue(orgids.map(a => a.path).join(', '))
}

function lastEmptyRow(sheet) {
  const data = sheet.getDataRange().getValues()
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    let empty = true
    row.forEach(cell => {
      if (cell) {
        empty = false
      }
    })
    if (empty) {
      return i + 1
    }
  }
}

function createGamCommands(sheet, rowIndex) {
  let pre = `gam update chromepolicy orgUnit`
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  sheet = sheet ? sheet : ss.getActiveSheet()
  const [head, ...data] = sheet.getDataRange().getValues()
  const index = rowIndex - 2
  const row = data[index]
  const orgPaths = row[head.indexOf(headerObj[lan].orgPaths)] ? row[head.indexOf(headerObj[lan].orgPaths)] : ''
  const policyName = row[head.indexOf(headerObj[lan].policyName)] ? row[head.indexOf(headerObj[lan].policyName)] : ''

  const policyValue = row[head.indexOf(headerObj[lan].policyValue)] ? JSON.parse(row[head.indexOf(headerObj[lan].policyValue)]) : {}
  const vals = Object.keys(policyValue).map(k => `${k} ${JSON.stringify(policyValue[k])}`).join(' ').replace(/"/g,'')
  const pathArray = orgPaths.split(',').map(org=>org.trim())
  const gams = pathArray.map(org => `${pre} "${org}" ${policyName} ${vals}`).join('\n\n')
  const col = head.indexOf(headerObj[lan].gamCmd)
  sheet.getRange(rowIndex, col + 1).setValue(gams)
}

function test_messageType() {
  const field = [{
    name: 'sessionDurationLimit',
    number: 1,
    label: 'LABEL_OPTIONAL',
    type: 'TYPE_MESSAGE',
    typeName: 'NullableDuration'
  }]

  const obj = {
    SessionLength:
      [{
        name: 'sessionDurationLimit',
        number: 1,
        label: 'LABEL_OPTIONAL',
        type: 'TYPE_MESSAGE',
        typeName: 'NullableDuration'
      }],
    NullableDuration:
      [{
        name: 'duration',
        number: 1,
        label: 'LABEL_OPTIONAL',
        type: 'TYPE_MESSAGE',
        typeName: 'Duration'
      }],
    Duration:
      [{
        name: 'seconds',
        number: 1,
        label: 'LABEL_OPTIONAL',
        type: 'TYPE_INT64'
      },
      {
        name: 'nanos',
        number: 2,
        label: 'LABEL_OPTIONAL',
        type: 'TYPE_INT32'
      }]
  }


  const msg = messageType(field, obj)
  console.log('final', msg)
}

function messageType(field, object) {
  const elem = (el) => el.type == 'TYPE_MESSAGE'
  const hasTypename = field.some(elem)
  let obj = {}
  if (hasTypename) {
    obj[field[0].name] = messageType(object[field[0].typeName], object)
    return obj
  } else {
    field.forEach(f => {
      if (f.type == 'TYPE_ENUM') {
        obj[f.name] = object[f.typeName].join(', ')
      } else {
        obj[f.name] = (defaults[f.type] != null || defaults[f.type] != undefined) ? defaults[f.type] : ''
      }
    })
    return obj
  }
}

function setDropdown(array, range) {
  const rule = SpreadsheetApp.newDataValidation().requireValueInList(array)
  range.setDataValidation(rule)
}