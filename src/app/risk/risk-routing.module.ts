import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewRiskComponent } from './new-risk/new-risk.component';
import { RiskListComponent } from './risk-list/risk-list.component';
import { RiskDetailComponent } from './risk-detail/risk-detail.component';
import { EditRiskComponent } from './edit-risk/edit-risk.component';

const routes: Routes = [
  {
    path: '',
    component: RiskListComponent
  },
  {
    path: 'list',
    component: RiskListComponent
  },
  {
    path: 'new',
    component: NewRiskComponent
  },
  {
    path: ':id/edit',
    component: EditRiskComponent
  },
  {
    path: ':id',
    component: RiskDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiskRoutingModule { }
