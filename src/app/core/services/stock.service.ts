import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Stock } from '../models/features.models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockService {

   private apiUrl = `${environment.apiUrl}/Stock`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Stock[]> {

  return this.http
    .get<ApiResponse<Stock[]>>(this.apiUrl)
    .pipe(
      map(response => response.data)
    );
}
}
