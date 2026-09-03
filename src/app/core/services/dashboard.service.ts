import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { DashboardSummary, RecentTransaction, LowStockProduct } from '../models/features.models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl =
    'http://localhost:8080/api/Dashboard';

  constructor(
    private http: HttpClient
  ) {}

  getSummary():
    Observable<DashboardSummary> {

    return this.http
      .get<ApiResponse<DashboardSummary>>(
        `${this.apiUrl}/summary`
      )
      .pipe(
        map(response => response.data)
      );

  }


  getRecentTransactions(
    count: number = 10
  ): Observable<RecentTransaction[]> {

    return this.http
      .get<ApiResponse<RecentTransaction[]>>(
        `${this.apiUrl}/recent-transactions?count=${count}`
      )
      .pipe(
        map(response => response.data)
      );

  }


  getLowStockProducts():
    Observable<LowStockProduct[]> {

    return this.http
      .get<ApiResponse<LowStockProduct[]>>(
        `${this.apiUrl}/low-stock`
      )
      .pipe(
        map(response => response.data)
      );

  }

}
