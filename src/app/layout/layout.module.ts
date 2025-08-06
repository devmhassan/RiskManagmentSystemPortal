import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomLayoutComponent } from './custom-layout.component';

@NgModule({
  declarations: [
    CustomLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    CustomLayoutComponent
  ]
})
export class LayoutModule { }
