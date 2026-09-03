import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Category } from '../models/features.models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = `${environment.apiUrl}/Category`;

  constructor(
    private http: HttpClient
  ) {}

  getAll(): Observable<Category[]> {

    return this.http
      .get<ApiResponse<Category[]>>(
        this.apiUrl
      )
      .pipe(
        map(response => response.data)
      );
  }

  create(category: Category): Observable<Category>
  {

  return this.http
    .post<ApiResponse<Category>>(
      this.apiUrl,
      category
    )
    .pipe(
      map(response => response.data)
    );
 }

 getById(id: number): Observable<Category>
 {

  return this.http
    .get<ApiResponse<Category>>(
      `${this.apiUrl}/${id}`
    )
    .pipe(
      map(response => response.data)
    );
}

update(id: number, category: Category): Observable<Category> {

  return this.http
    .put<ApiResponse<Category>>(
      `${this.apiUrl}/${id}`,
      category
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
