import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/user';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private baseUrl: string = environment.baseUrl;
    private _user: any;

    private getHeaders(): HttpHeaders {
        const token = this.getToken();
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    get user() {
        return this._user;
    }
    
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

    getUserId(email: string): Observable<string> {
        const url = `${this.baseUrl}/auth/users/${email}`;
        const headers = this.getHeaders();
        return this.http.get<any>(url,{ headers }).pipe(
            catchError((error) => {
                console.error('Error user not found:', error);
                throw error;
            })
        );
    }

    validateToken(): Observable<boolean> {
        const url = `${this.baseUrl}/auth/validate`;

        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);

        return this.http.get<User | null>(url, { headers }).pipe(
            map(user => {
                if (user && user.email) {
                    this._user = user.email;
                    return true;
                } else {
                    return false;
                }
            }),
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
