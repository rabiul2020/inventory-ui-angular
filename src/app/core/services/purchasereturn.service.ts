import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/api-response.model';
import {
  CreatePurchaseReturnRequest,
  PurchaseReturn,
  PurchaseWiseReturnQty,
} from '../models/features.models';

@Injectable({
  providedIn: 'root'
})
export class PurchaseReturnService {

  private apiUrl =
    `${environment.apiUrl}/PurchaseReturn`;

  constructor(
    private http: HttpClient
  ) {}

  getAll(): Observable<PurchaseReturn[]> {

    return this.http
      .get<ApiResponse<PurchaseReturn[]>>(
        this.apiUrl
      )
      .pipe(
        map(response => response.data)
      );
  }

  getById(
    id: number
  ): Observable<PurchaseReturn> {

    return this.http
      .get<ApiResponse<PurchaseReturn>>(
        `${this.apiUrl}/${id}`
      )
      .pipe(
        map(response => response.data)
      );
  }

  getPurchaseWiseReturn(
  id: number
): Observable<PurchaseWiseReturnQty[]> {
  return this.http
    .get<ApiResponse<PurchaseWiseReturnQty[]>>(
      `${this.apiUrl}/get-returnqty/${id}`
    )
    .pipe(
      tap(response => {
        console.log('Full API Response:', response);
        console.log('Response Data:', response.data);
      }),
      map(response => response.data)
    );
}

  create(
    request: CreatePurchaseReturnRequest
  ): Observable<PurchaseReturn> {

    return this.http
      .post<ApiResponse<PurchaseReturn>>(
        this.apiUrl,
        request
      )
      .pipe(
        map(response => response.data)
      );
  }

  update(
    id: number,
    request: CreatePurchaseReturnRequest
  ): Observable<void> {

    return this.http
      .put<ApiResponse<object>>(
        `${this.apiUrl}/${id}`,
        request
      )
      .pipe(
        map(() => undefined)
      );
  }

  delete(
    id: number
  ): Observable<void> {

    return this.http
      .delete<ApiResponse<object>>(
        `${this.apiUrl}/${id}`
      )
      .pipe(
        map(() => undefined)
      );
  }
}
