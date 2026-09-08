import { environment } from "src/environments/environment";
import { LoginRequest, LoginResponse,JwtPayload} from "../models/auth.models";
import { Observable } from "rxjs";
import { ApiResponse } from "../models/api-response.model";
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { jwtDecode } from 'jwt-decode';
//import { jwtDecode, JwtPayload } from "jwt-decode";
//import { jwtDecode, JwtPayload } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})

export class AuthService
{
  private readonly apiUrl = `${environment.apiUrl}/Auth`;

    private readonly tokenKey = 'inventory_token';
    private readonly userKey = 'inventory_user';

  constructor(private http: HttpClient)
  {


  }

   login(request: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.apiUrl}/login`,
      request
    );
  }

  saveLoginData(response: LoginResponse): void {

    localStorage.setItem(
      this.tokenKey,
      response.token
    );

    localStorage.setItem(
      this.userKey,
      JSON.stringify({
        userId: response.userId,
        userName: response.userName,
        email: response.email,
        roles: response.roles
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {

  const token = this.getToken();

  if (!token) {
    return null;
  }

  try {

    const decoded = jwtDecode<JwtPayload>(token);

    return decoded.role ?? null;

  } catch {

    return null;
  }
}

getPermissions(): string[] {

  const token = this.getToken();

  if (!token) {
    return [];
  }

  try {

    const decoded = jwtDecode<JwtPayload>(token);

    return decoded.permission ?? [];

  } catch {

    return [];
  }
}

hasRole(role: string): boolean {

    return this.getRole() === role;
  }

  hasPermission(permission: string): boolean {

    return this.getPermissions()
      .includes(permission);
  }

  logout(): void {

    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }


}

