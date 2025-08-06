import { Component } from '@angular/core';
import { AuthService } from '@abp/ng.core';
import { ConfigStateService } from '@abp/ng.core';

@Component({
  selector: 'app-custom-layout',
  templateUrl: './custom-layout.component.html',
  styleUrls: ['./custom-layout.component.scss']
})
export class CustomLayoutComponent {
  currentUser$ = this.configStateService.getOne$('currentUser');

  constructor(
    private authService: AuthService,
    private configStateService: ConfigStateService
  ) {}

  logout() {
    this.authService.logout().subscribe();
  }
}
