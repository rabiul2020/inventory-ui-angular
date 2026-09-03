import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Product } from '../models/features.models';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiUrl}/Product`;

  constructor(
    private http: HttpClient
  ) {}

  getAll(): Observable<Product[]> {

    return this.http
      .get<ApiResponse<Product[]>>(this.apiUrl)
      .pipe(
        map(response => response.data)
      );
  }


  create(product: Product): Observable<Product>
  {
    console.log(product);
  return this.http
    .post<ApiResponse<Product>>(
      this.apiUrl,
      product
    )
    .pipe(
      map(response => response.data)
    );
}


getById(id: number): Observable<Product> {

  return this.http
    .get<ApiResponse<Product>>(
      `${this.apiUrl}/${id}`
    )
    .pipe(
      map(response => response.data)
    );
}

update(id: number, product: Product): Observable<Product> {

  return this.http
    .put<ApiResponse<Product>>(
      `${this.apiUrl}/${id}`,
      product
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
