import { Component, OnInit } from '@angular/core';

import { Menu } from 'src/app/core/models/auth.models';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  menus: Menu[] = [];

  constructor(
    private menuService: MenuService
  ) {}

  ngOnInit(): void {

    this.menuService.getMyMenus().subscribe({
      next: (menus) => {

        this.menus = menus;

        console.log('Dynamic Menus:', this.menus);
      },

      error: (error) => {

        console.error(
          'Failed to load menus:',
          error
        );

      }
    });
  }
}
