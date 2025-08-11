import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionTrackerComponent } from './action-tracker.component';
import { ActionTrackerViewComponent } from './action-tracker-view/action-tracker-view.component';

const routes: Routes = [
  {
    path: '',
    component: ActionTrackerComponent
  },
  {
    path: 'view/:actionId',
    component: ActionTrackerViewComponent
  },
  {
    path: 'view/:actionId/:riskId',
    component: ActionTrackerViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActionTrackerRoutingModule { }
