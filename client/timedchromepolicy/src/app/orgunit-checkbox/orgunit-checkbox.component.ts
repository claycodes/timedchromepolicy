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

import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Orgunits, OrgunitLevels, FlatNode } from '../org-units';
import { DataPipelineService } from '../data-pipeline.service';
import { ArrayDataSource } from '@angular/cdk/collections';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { CdkTree, CdkTreeNode, NestedTreeControl, TreeControl, CdkTreeNodeDef } from '@angular/cdk/tree';



@Component({
  selector: 'app-orgunit-checkbox',
  templateUrl: './orgunit-checkbox.component.html',
  styleUrls: ['./orgunit-checkbox.component.css']
})
export class OrgunitCheckboxComponent implements OnInit {

  private _transformer = (node: Orgunits, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      id: node.orgUnitId,
      path: node.orgUnitPath
    };
  };

  orgUnits: Orgunits[] = []

  list: any[] = []
  loading: boolean = true

  @Output() selectedList = new EventEmitter<string>();

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  )


  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: Orgunits) => node.expandable;

  constructor(public data: DataPipelineService, private ref: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.orgUnits = this.data.orgUnits.getValue()

    this.data.orgUnits.subscribe(orgs => {
      this.orgUnits = orgs
      if (orgs[0].orgUnitId != 'loadid' || !orgs[0].orgUnitId) {
        this.loading = false
      }
      this.dataSource.data = orgs
      this.ref.detectChanges()
    })
    this.loadOrgs()
  }

  loadOrgs() {
    this.data.getNestedOrgs()
  }

  changeSelection(value: any) {
    if ((<HTMLInputElement>document.getElementById(value)).checked === true) {
      const path = (<HTMLInputElement>document.getElementById(value)).dataset['orgpath']
      this.list.push({ id: value, path: path });
    }
    else if ((<HTMLInputElement>document.getElementById(value)).checked === false) {
      const elem = (el: any) => el.id === value
      const indexx = this.list.findIndex(elem);
      this.list.splice(indexx, 1)
    }
    this.selectedList.emit(JSON.stringify(this.list));
  }

  uncheckAll() {
    console.log('unchecking')
    const ids = this.list.map(a => a.id)
    ids.forEach(elem => {
      (<HTMLInputElement>document.getElementById(elem)).checked = false
    })
    this.list = []
  }

}

