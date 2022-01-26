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

const activeLanguages=['en']
const lan =activeLanguages.includes(Session.getActiveUserLocale().slice(0,2))? Session.getActiveUserLocale().slice(0,2):'en'

const timeSuffix = { en: { regex: 'am|pm', defaultSuffix: 'AM', am: 'am', pm: 'pm' } }

const headerObj = { en: {name:'Name', orgIds:'OrgIds', orgPaths:'OrgPaths', policyType:'Policy Type', policyName:'Policy Name', policyValue:'Policy Value', freqUnit:'Frequency Unit', freqValue1:'Frequency Unit Value1', freqValue2:'Frequency Unit Value2', active:'Active', lastUpdate:'Last Update', gamCmd:'GAM Commands'} } //Order informs Sheet column order

const freq = { en: {hourly:'Hourly', daily:'Daily', weekly:'Weekly', monthly:'Monthly', specific:'Specific Date'}}

const units = {
    en: {
        Hourly: [...Array(25).keys()],
        Daily: [...Array(25).keys()].map(k => k < 12 ? (k == 0 ? '12:00 AM' : k + ':00 AM') : (k == 12 ? '12:00 PM' : (k - 12) + ':00 PM')),

        Weekly: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        Monthly: [...Array(32).keys()],
        'Specific Date': [...Array(25).keys()].map(k => k < 12 ? (k == 0 ? '12:00 AM' : k + ':00 AM') : (k == 12 ? '12:00 PM' : (k - 12) + ':00 PM')),
    }
}

const messages={
  en:{
    processing:'Processing...'
  }
}

const defaults = {
    TYPE_INT32: 0,
    TYPE_INT64: 0,
    TYPE_STRING: '',
    TYPE_BOOL: false
}
