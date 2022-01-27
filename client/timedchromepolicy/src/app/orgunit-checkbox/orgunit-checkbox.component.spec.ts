import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgunitCheckboxComponent } from './orgunit-checkbox.component';

describe('OrgunitCheckboxComponent', () => {
  let component: OrgunitCheckboxComponent;
  let fixture: ComponentFixture<OrgunitCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrgunitCheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgunitCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
