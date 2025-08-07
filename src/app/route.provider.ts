import { RoutesService, eLayoutType } from '@abp/ng.core';
import { APP_INITIALIZER } from '@angular/core';

export const APP_ROUTE_PROVIDER = [
  { provide: APP_INITIALIZER, useFactory: configureRoutes, deps: [RoutesService], multi: true },
];

function configureRoutes(routes: RoutesService) {
  return () => {
    routes.add([
      {
        path: '/',
        name: '::Menu:Home',
        iconClass: 'fas fa-home',
        order: 1,
        layout: eLayoutType.application,
      },
      {
        path: '/risk',
        name: 'Risk Management',
        iconClass: 'fas fa-exclamation-triangle',
        order: 2,
        layout: eLayoutType.application
      },
      {
        path: '/action-tracker',
        name: 'Action Tracker',
        iconClass: 'fas fa-tasks',
        order: 3,
        layout: eLayoutType.application
      },
      {
        path: '/risk/new',
        name: 'Add New Risk',
        parentName: 'Risk Management',
        order: 1,
        layout: eLayoutType.application
      }
    ]);
  };
}
