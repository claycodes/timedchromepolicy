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

export interface Orgunits {
    orgUnitPath: string;
    orgUnitId: string;
    name:string;
    parentOrgUnitId?:string;
    parentOrgUnitPath?:string;
    kind?:string;
    etag?:string;
    children?:Orgunits[];
    level?:number;
    expandable?:boolean;
}

export interface OrgunitLevels {
    orgUnitPath: string;
    orgUnitId?: string;
    name?:string;
    parentOrgUnitId?:string;
    parentOrgUnitPath?:string;
    kind?:string;
    etag?:string;
    children?:Orgunits[];
    level:number;
    expandable:boolean;
    isExpanded?: boolean;
}

export interface FlatNode {
    expandable: boolean;
    name: string;
    level: number;
    id:string;
    path:string;
  }

  