import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RiskRoutingModule } from './risk-routing.module';
import { CoreModule } from '@abp/ng.core';
import { ThemeSharedModule } from '@abp/ng.theme.shared';
import { RiskListComponent } from './risk-list/risk-list.component';
import { RiskDetailComponent } from './risk-detail/risk-detail.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    ThemeSharedModule,
    SharedModule,
    RiskRoutingModule,
    RiskListComponent,
    RiskDetailComponent
  ]
})
export class RiskModule { }
