import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/api-response.model';

import {
  CreateSalesReturnRequest,
  SalesReturn,
  SalesWiseReturnQty
} from '../models/features.models';


@Injectable({
  providedIn: 'root'
})
export class SalesReturnService {

  private apiUrl =
    `${environment.apiUrl}/SalesReturns`;


  constructor(
    private http: HttpClient
  ) {}


  getAll(): Observable<SalesReturn[]> {

    return this.http
      .get<ApiResponse<SalesReturn[]>>(
        this.apiUrl
      )
      .pipe(
        map(response => response.data)
      );
  }


  getById(
    id: number
  ): Observable<SalesReturn> {

    return this.http
      .get<ApiResponse<SalesReturn>>(
        `${this.apiUrl}/${id}`
      )
      .pipe(
        map(response => response.data)
      );
  }


  create(
    salesReturn: CreateSalesReturnRequest
  ): Observable<SalesReturn> {

    return this.http
      .post<ApiResponse<SalesReturn>>(
        this.apiUrl,
        salesReturn
      )
      .pipe(
        map(response => response.data)
      );
  }


  update(
    id: number,
    salesReturn: CreateSalesReturnRequest
  ): Observable<void> {

    return this.http
      .put<ApiResponse<object>>(
        `${this.apiUrl}/${id}`,
        salesReturn
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




getSalesWiseReturnQty(
  salesId: number
): Observable<SalesWiseReturnQty[]>
{
  alert(salesId);

  return this.http
    .get<ApiResponse<SalesWiseReturnQty[]>>(
      `${this.apiUrl}/get-returnqty/${salesId}`
    )
    .pipe(
      tap(response => {
        console.log('Full Response:', response);
        console.log('Response Data:', response.data);
      }),
      map(response => response.data)
    );
}

}
