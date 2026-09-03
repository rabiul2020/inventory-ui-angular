import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  sidebarCollapsed = false;

  constructor(
    private renderer: Renderer2,
    private authService: AuthService,
    private router: Router
  ) {}

  toggleSidebar(): void {

    this.sidebarCollapsed = !this.sidebarCollapsed;

    const body = document.body;

    if (this.sidebarCollapsed) {
      this.renderer.addClass(body, 'sidenav-toggled');
      this.renderer.addClass(body, 'sidenav-toggled-open');
    } else {
      this.renderer.removeClass(body, 'sidenav-toggled');
      this.renderer.removeClass(body, 'sidenav-toggled-open');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
