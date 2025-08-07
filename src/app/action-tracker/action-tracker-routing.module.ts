import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionTrackerComponent } from './action-tracker.component';

const routes: Routes = [
  {
    path: '',
    component: ActionTrackerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActionTrackerRoutingModule { }
