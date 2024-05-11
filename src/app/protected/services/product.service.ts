import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { catchError} from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getProducts(limit: number = 10, page: number = 0) {
    const headers = this.getHeaders();
    const url = `${this.baseUrl}/products?limit=${limit}&page=${page}`;
    return this.http.get<any>(url, { headers });
  }

  getProduct(term: string) {
    const headers = this.getHeaders();
    const url = `${this.baseUrl}/products/${term}`;
    return this.http.get<any>(url, { headers });
  }

  updateProduct(id: string, product:any){
    const url = `${this.baseUrl}/products/${id}`;
    const headers = this.getHeaders();
    return this.http.patch<any>(url, product, { headers }).pipe(
      catchError((error) => {
        console.error('Error updating product:', error);
        throw error;
      })
    );
  }

  createProduct(product: any) {
    const url = `${this.baseUrl}/products`;
    const headers = this.getHeaders();
    return this.http.post<any>(url, product, { headers }).pipe(
      catchError((error) => {
        console.error('Error creating product:', error);
        throw error;
      })
    );
  }

  deleteProduct(id: string): Observable<void> {
    const url = `${this.baseUrl}/products/${id}`;
    const headers = this.getHeaders();
    return this.http.delete<void>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error deleting product:', error);
        throw error;
      })
    );
  }
}

