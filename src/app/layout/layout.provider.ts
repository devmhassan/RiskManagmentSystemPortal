import { eLayoutType } from '@abp/ng.core';
import { APP_INITIALIZER } from '@angular/core';
import { CustomLayoutComponent } from './custom-layout.component';
import { LAYOUT_CONFIG, LayoutConfig } from '@abp/ng.theme.basic';

export const LAYOUT_PROVIDER = {
  provide: LAYOUT_CONFIG,
  useValue: {
    application: {
      layout: CustomLayoutComponent
    }
  } as LayoutConfig
};
