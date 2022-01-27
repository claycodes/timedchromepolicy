import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { OrgunitCheckboxComponent } from './orgunit-checkbox/orgunit-checkbox.component';

import { CdkAccordionModule } from '@angular/cdk/accordion';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    OrgunitCheckboxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CdkAccordionModule,
    CdkTreeModule,
    MatIconModule,
    MatTreeModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
