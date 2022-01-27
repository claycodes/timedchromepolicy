import { Component, ViewChild, OnInit } from '@angular/core';
import { OrgunitCheckboxComponent } from '../orgunit-checkbox/orgunit-checkbox.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  selections:string[]=[]
  dis:boolean =true
  @ViewChild(OrgunitCheckboxComponent) child!: OrgunitCheckboxComponent;

  constructor() { }

  ngOnInit(): void {
  }

  setSelection(item:string){
      this.selections=JSON.parse(item)
      this.dis =this.selections.length==0
      console.log(this.dis)
  }

  sendOrgs(){
    console.log(this.selections)
     // @ts-ignore: Unreachable code error
     google.script.run.withSuccessHandler((e) => {

    }).insertOrgIds(this.selections)
    this.child.uncheckAll()
    this.selections=[]
  }
  
}
