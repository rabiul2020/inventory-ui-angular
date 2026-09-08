import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Menu } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class MenuService
{
 private apiUrl = `${environment.apiUrl}/Menu`;
  constructor(private http: HttpClient)
  {

  }

   getMyMenus(): Observable<Menu[]> {

    return this.http
      .get<ApiResponse<Menu[]>>(
        `${this.apiUrl}/MyMenus`
      )
      .pipe(
        map(response => response.data)
      );
  }

}
