import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { JwtPayload, Menu } from './core/models/auth.models';
import { jwtDecode } from 'jwt-decode';
import { MenuService } from './core/services/menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit
{
  title = 'inventory-ui';
    menus: Menu[] = [];

    constructor(
    private menuService: MenuService
  ) {}

  ngOnInit(): void {



  }




/*   testAuthorization(): void {


    const token = this.authService.getToken();

  console.log('Token:', token);

  if (token) {

    const decoded = jwtDecode<JwtPayload>(token);

    console.log('Decoded JWT:', decoded);
    console.log('Decoded keys:', Object.keys(decoded));

  }

  console.log(
    'Role:',
    this.authService.getRole()
  );

  console.log(
    'Permissions:',
    this.authService.getPermissions()
  );

  console.log(
    'Is Admin:',
    this.authService.hasRole('Admin')
  );

  console.log(
    'Product View:',
    this.authService.hasPermission('Product.View')
  );

  console.log(
    'Product Delete:',
    this.authService.hasPermission('Product.Delete')
  );
}
 */



}
