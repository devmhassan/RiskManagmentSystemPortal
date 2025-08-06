import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewRiskComponent } from './new-risk/new-risk.component';
import { RiskListComponent } from './risk-list/risk-list.component';

const routes: Routes = [
  {
    path: '',
    component: RiskListComponent
  },
  {
    path: 'new',
    component: NewRiskComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiskRoutingModule { }
