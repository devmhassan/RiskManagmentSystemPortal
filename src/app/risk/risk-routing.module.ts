import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewRiskComponent } from './new-risk/new-risk.component';

const routes: Routes = [
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
