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

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Orgunits, OrgunitLevels } from './org-units';

@Injectable({
  providedIn: 'root'
})
export class DataPipelineService {
  public orgUnits = new BehaviorSubject<Orgunits[]>([{ orgUnitId:'loadid', name: 'Loading...', orgUnitPath: '/', level: 0, expandable: false}]);
  public setorgs= new BehaviorSubject<string[]>([])

  constructor() { }

  getNestedOrgs() {
    // @ts-ignore: Unreachable code error
    google.script.run.withSuccessHandler((e) => {
      this.orgUnits.next(e)
    }).nestOrgs()
  }

  setOrg(org:any) {
    const orgs=this.setorgs.getValue()
    orgs.push(org)
    this.setorgs.next(orgs)
  }

 
}
