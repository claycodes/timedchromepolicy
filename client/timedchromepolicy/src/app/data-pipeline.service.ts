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
