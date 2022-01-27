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

  