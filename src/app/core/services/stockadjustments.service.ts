import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from 'src/environments/environment';

import { ApiResponse } from '../models/api-response.model';

import {
  StockAdjustment,
  CreateStockAdjustmentRequest
} from '../models/features.models';


@Injectable({
  providedIn: 'root'
})
export class StockAdjustmentService {

  private apiUrl =
    `${environment.apiUrl}/StockAdjustments`;


  constructor(
    private http: HttpClient
  ) {}


  getAll(): Observable<StockAdjustment[]> {

    return this.http
      .get<ApiResponse<StockAdjustment[]>>(
        this.apiUrl
      )
      .pipe(
        map(response => response.data)
      );

  }


  getById(
    id: number
  ): Observable<StockAdjustment> {

    return this.http
      .get<ApiResponse<StockAdjustment>>(
        `${this.apiUrl}/${id}`
      )
      .pipe(
        map(response => response.data)
      );

  }


  create(
    adjustment: CreateStockAdjustmentRequest
  ): Observable<StockAdjustment> {

    return this.http
      .post<ApiResponse<StockAdjustment>>(
        this.apiUrl,
        adjustment
      )
      .pipe(
        map(response => response.data)
      );

  }


  update(
    id: number,
    adjustment: CreateStockAdjustmentRequest
  ): Observable<void> {

    return this.http
      .put<ApiResponse<object>>(
        `${this.apiUrl}/${id}`,
        adjustment
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
