import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import {
  RegisterRequest,
  UserDto,
  UpdateUserDto,
  UpdateUserRolesDto,
  RoleDto
} from '../models/features.models';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // TODO: move to environment.ts (environment.apiBaseUrl) instead of hardcoding
  private apiUrl = 'http://localhost:8080/api/User';
  private authApiUrl = 'http://localhost:8080/api/Auth';
  private roleApiUrl = 'http://localhost:8080/api/Role';

  constructor(private http: HttpClient) {}

  getAll(): Observable<UserDto[]> {
    return this.http
      .get<ApiResponse<UserDto[]>>(this.apiUrl)
      .pipe(map(response => response.data));
  }

  getById(id: string): Observable<UserDto> {
    return this.http
      .get<ApiResponse<UserDto>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  register(request: RegisterRequest): Observable<string> {
    return this.http
      .post<ApiResponse<string>>(`${this.authApiUrl}/register`, request)
      .pipe(map(response => response.data));
  }

  update(id: string, request: UpdateUserDto): Observable<void> {
    return this.http
      .put<ApiResponse<object>>(`${this.apiUrl}/${id}`, request)
      .pipe(map(() => void 0));
  }

  updateRoles(request: UpdateUserRolesDto): Observable<void> {
    return this.http
      .put<ApiResponse<object>>(`${this.apiUrl}/roles`, request)
      .pipe(map(() => void 0));
  }

  activate(id: string): Observable<void> {
    return this.http
      .put<ApiResponse<object>>(`${this.apiUrl}/${id}/activate`, {})
      .pipe(map(() => void 0));
  }

  deactivate(id: string): Observable<void> {
    return this.http
      .put<ApiResponse<object>>(`${this.apiUrl}/${id}/deactivate`, {})
      .pipe(map(() => void 0));
  }

  getAllRoles(): Observable<RoleDto[]> {
    return this.http
      .get<ApiResponse<RoleDto[]>>(this.roleApiUrl)
      .pipe(map(response => response.data));
  }
}
