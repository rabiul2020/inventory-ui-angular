import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/api-response.model';
import {
  CreateSaleRequest,
  Sales
} from '../models/features.models';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private apiUrl = `${environment.apiUrl}/Sales`;

  constructor(
    private http: HttpClient
  ) {}


  getAll(): Observable<Sales[]> {

    return this.http
      .get<ApiResponse<Sales[]>>(this.apiUrl)
      .pipe(
        map(response => response.data)
      );
  }


  getById(id: number): Observable<Sales> {

    return this.http
      .get<ApiResponse<Sales>>(
        `${this.apiUrl}/${id}`
      )
      .pipe(
        map(response => response.data)
      );
  }


  create(
    sale: CreateSaleRequest
  ): Observable<Sales> {

    return this.http
      .post<ApiResponse<Sales>>(
        this.apiUrl,
        sale
      )
      .pipe(
        map(response => response.data)
      );
  }


  update(
    id: number,
    sale: CreateSaleRequest
  ): Observable<void> {

    return this.http
      .put<ApiResponse<object>>(
        `${this.apiUrl}/${id}`,
        sale
      )
      .pipe(
        map(() => undefined)
      );
  }


  delete(id: number): Observable<void> {

    return this.http
      .delete<ApiResponse<object>>(
        `${this.apiUrl}/${id}`
      )
      .pipe(
        map(() => undefined)
      );
  }

}
