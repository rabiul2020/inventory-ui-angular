import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Customer } from '../models/features.models';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = `${environment.apiUrl}/Customer`;

  constructor(
    private http: HttpClient
  ) {}

  getAll(): Observable<Customer[]> {

    return this.http
      .get<ApiResponse<Customer[]>>(this.apiUrl)
      .pipe(
        map(response => response.data)
      );
  }

  getById(id: number): Observable<Customer> {

    return this.http
      .get<ApiResponse<Customer>>(
        `${this.apiUrl}/${id}`
      )
      .pipe(
        map(response => response.data)
      );
  }

  create(customer: Customer): Observable<Customer> {

    return this.http
      .post<ApiResponse<Customer>>(
        this.apiUrl,
        customer
      )
      .pipe(
        map(response => response.data)
      );
  }

  update(
    id: number,
    customer: Customer
  ): Observable<Customer> {

    return this.http
      .put<ApiResponse<Customer>>(
        `${this.apiUrl}/${id}`,
        customer
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
