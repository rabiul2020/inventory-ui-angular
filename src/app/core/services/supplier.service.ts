import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Supplier } from '../models/features.models';


@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private apiUrl = `${environment.apiUrl}/Supplier`;

  constructor(
    private http: HttpClient
  ) {}

  getAll(): Observable<Supplier[]> {

    return this.http
      .get<ApiResponse<Supplier[]>>(this.apiUrl)
      .pipe(
        map(response => response.data)
      );
  }

  getById(id: number): Observable<Supplier> {

    return this.http
      .get<ApiResponse<Supplier>>(
        `${this.apiUrl}/${id}`
      )
      .pipe(
        map(response => response.data)
      );
  }

  create(supplier: Supplier): Observable<Supplier> {

    return this.http
      .post<ApiResponse<Supplier>>(
        this.apiUrl,
        supplier
      )
      .pipe(
        map(response => response.data)
      );
  }

  update(
    id: number,
    supplier: Supplier
  ): Observable<Supplier> {

    return this.http
      .put<ApiResponse<Supplier>>(
        `${this.apiUrl}/${id}`,
        supplier
      )
      .pipe(
        map(response => response.data)
      );
  }

  delete(id: number): Observable<void> {

    return this.http
      .delete<void>(
        `${this.apiUrl}/${id}`
      );
  }
}
