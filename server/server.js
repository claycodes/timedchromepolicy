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

// @OnlyCurrentDoc

function doGet(e) {
    return HtmlService.createHtmlOutputFromFile('client/index.html')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
  }
  
  const menu = {
    en: {
      orgs: { label: 'Select OrgUnits', func: 'showSidebar' },
      setup: { label: 'Setup Sheet', func: 'sheetSetup', noAuth: true },
      reset: { label: 'Reset', func: 'reset' }
    }
  }
  
  function setMenu(e) {
    const ui = SpreadsheetApp.getUi().createAddonMenu()
    let keys
    keys = Object.keys(menu[lan]).filter(item => menu[lan][item].noAuth)
    if (e && e.authMode == ScriptApp.AuthMode.NONE) {
    }
    else{
      const properties = PropertiesService.getDocumentProperties();
      const reset = properties.getProperty('reset');
      if (reset) {
        keys = Object.keys(menu[lan])
      }
    }

    keys.forEach(key => {
      ui.addItem(menu[lan][key].label, menu[lan][key].func)
    })
    ui.addToUi()
  }
  
  function onOpen(e) {
    setMenu(e)
  }
  
  function onInstall(e) {
    onOpen(e);
  }
  
  function showSidebar() {
    const ui = HtmlService.createHtmlOutputFromFile('client/index.html')
      .setTitle('Select OrgUnit');
    SpreadsheetApp.getUi().showSidebar(ui);
  
  }
  
  
  function reset() {
    const ui = SpreadsheetApp.getUi();
    const response = ui.alert('Are you sure you want to reset?',
      ui.ButtonSet.YES_NO);
    if (response == ui.Button.YES) {
      resetSheet()
    }
    setMenu()
  }
  
  function resetSheet() {
    resetProps()
    ScriptApp.getScriptTriggers().forEach(trig => {
      ScriptApp.deleteTrigger(trig)
    })
  }
  
  function resetProps() {
    const properties = PropertiesService.getScriptProperties()
    properties.deleteAllProperties()
  }
  
  
  function sheetSetup() {
    const properties = PropertiesService.getDocumentProperties();
    properties.setProperty('reset', 'true')
    setHeader()
    setPolicyCategory()
    setActiveCheckbox()
    setUnitDropDown()
  
    const hasTrigger = ScriptApp.getScriptTriggers().map(trig => trig.getHandlerFunction()).includes('editListener')
    if (!hasTrigger) {
      ScriptApp.newTrigger('editListener').forSpreadsheet(SpreadsheetApp.getActive()).onEdit().create()
    }
  
    const hasTriggerHourly = ScriptApp.getScriptTriggers().map(trig => trig.getHandlerFunction()).includes('hourlyCheck')
    if (!hasTriggerHourly) {
      ScriptApp.newTrigger('hourlyCheck').timeBased().everyHours(1).create()
    }
    setMenu()
  }
  
  
  function showDialog(route) {
    let ui = HtmlService.createTemplateFromFile('client/index.html');
    ui.route = route || 'home';
    ui = ui.evaluate().setWidth(800).setHeight(600);
    SpreadsheetApp.getUi().showModalDialog(ui, 'DialogBox')
  }