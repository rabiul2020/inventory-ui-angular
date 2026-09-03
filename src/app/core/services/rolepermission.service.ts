import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';


import {
  ApiResponse
} from '../models/api-response.model';
import { PermissionTree, RoleDto } from '../models/features.models';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {

  private apiUrl =
    'http://localhost:8080/api/Permission';

  private roleApiUrl =
    'http://localhost:8080/api/Role';


  constructor(
    private http: HttpClient
  ) {}


  // =========================================
  // Get all permissions tree
  // Used when creating a new role
  // =========================================

  getPermissionTree():
    Observable<PermissionTree[]> {

    return this.http
      .get<ApiResponse<PermissionTree[]>>(
        `${this.apiUrl}/tree`
      )
      .pipe(
        map(response => response.data)
      );
  }


  // =========================================
  // Get role permission tree
  // Used when editing a role
  // =========================================

  getRolePermissionTree(
    roleId: string
  ): Observable<PermissionTree[]> {

    return this.http
      .get<ApiResponse<PermissionTree[]>>(
        `${this.apiUrl}/role/${roleId}/tree`
      )
      .pipe(
        map(response => response.data)
      );
  }


  // =========================================
  // Update role permissions
  // =========================================

  updateRolePermissions(
    roleId: string,
    permissionIds: number[]
  ): Observable<any> {

    return this.http
      .put<ApiResponse<any>>(
        `${this.roleApiUrl}/${roleId}/permissions`,
        permissionIds
      );

  }

  createRole(
  name: string
): Observable<RoleDto> {

  const request = {
    name: name
  };

  return this.http
    .post<ApiResponse<RoleDto>>(
      this.roleApiUrl,
      request
    )
    .pipe(
      map(response => response.data)
    );

}


  getRoles(): Observable<RoleDto[]> {

  return this.http
    .get<ApiResponse<RoleDto[]>>(
      this.roleApiUrl
    )
    .pipe(
      map(response => response.data)
    );

}

updateRole(
  roleId: string,
  name: string
): Observable<any> {

  const request = {
    name: name
  };

  return this.http
    .put<ApiResponse<any>>(
      `${this.roleApiUrl}/${roleId}`,
      request
    );

}

}
