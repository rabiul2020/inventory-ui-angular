import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { CreatePurchaseRequest, Purchase } from '../models/features.models';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private apiUrl = `${environment.apiUrl}/Purchase`;

  constructor(
    private http: HttpClient
  ) {}

  getAll(): Observable<Purchase[]> {

    return this.http
      .get<ApiResponse<Purchase[]>>(this.apiUrl)
      .pipe(
        map(response => response.data)
      );
  }


  getById(id: number): Observable<Purchase> {

    return this.http
      .get<ApiResponse<Purchase>>(
        `${this.apiUrl}/${id}`
      )
      .pipe(
        map(response => response.data)
      );
  }


  create(
    purchase: CreatePurchaseRequest
  ): Observable<Purchase> {

    return this.http
      .post<ApiResponse<Purchase>>(
        this.apiUrl,
        purchase
      )
      .pipe(
        map(response => response.data)
      );
  }


  update(
    id: number,
    purchase: CreatePurchaseRequest
  ): Observable<void> {

    return this.http
      .put<ApiResponse<object>>(
        `${this.apiUrl}/${id}`,
        purchase
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
