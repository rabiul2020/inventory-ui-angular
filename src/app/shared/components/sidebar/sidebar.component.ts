import { Component, Input } from '@angular/core';
import { Menu } from 'src/app/core/models/auth.models';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  @Input() menus: Menu[] = [];

  expandedMenus: Set<number> = new Set<number>();

  toggleMenu(menuId: number): void {

    if (this.expandedMenus.has(menuId)) {
      this.expandedMenus.delete(menuId);
    } else {
      this.expandedMenus.add(menuId);
    }
  }

  isExpanded(menuId: number): boolean {
    return this.expandedMenus.has(menuId);
  }
}
