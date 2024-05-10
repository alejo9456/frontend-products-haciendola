import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private baseUrl: string = environment.baseUrl;
    
    constructor(private http: HttpClient) {}

    login(email: string, password: string): Observable<boolean> {
        const url = `${this.baseUrl}/auth/login`;
        const body = { email, password };

        return this.http.post<AuthResponse>(url, body).pipe(
            tap(response => {
                if (response.ok) {
                    localStorage.setItem('token', response.token);
                }
            }),
            map(response => response.ok),
            catchError(err => of(false))
        );
    }

    register(email: string, password: string, fullname: string): Observable<boolean> {
        const url = `${this.baseUrl}/auth/register`;
        const body = { email, password, fullname };

        return this.http.post<AuthResponse>(url, body).pipe(
            tap(response => {
                if (response.ok) {
                    localStorage.setItem('token', response.token);
                }
            }),
            map(response => response.ok),
            catchError(err => of(false))
        );
    }

    validateToken(): Observable<boolean> {
        const url = `${this.baseUrl}/auth/validate`;

        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);

        return this.http.get<boolean>(url, { headers }).pipe(
            catchError(() => of(false))
        );
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    logout(): void {
        localStorage.removeItem('token');
    }
}
