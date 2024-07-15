import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios, { AxiosInstance } from 'axios';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = 'https://task-management-backend-335t.onrender.com/api/auth';
    private axios: AxiosInstance;

    constructor(private router: Router) {
        this.axios = axios.create({
            baseURL: this.baseUrl
        });
    }

    signup(user: any): Observable<any> {
        return new Observable(observer => {
            this.axios.post('/signup', user)
                .then(response => {
                    observer.next(response.data);
                    observer.complete();
                })
                .catch(error => {
                    if (error.response && error.response.data && error.response.data.message) {
                        alert(error.response.data.message);
                    } else {
                        alert('An unexpected error occurred');
                    }
                });
        });
    }

    login(credentials: any): Observable<any> {
        return new Observable(observer => {
            this.axios.post<{ token: string }>('/login', credentials)
                .then(response => {
                    localStorage.setItem('authToken', response.data.token);
                    observer.next(response.data);
                    observer.complete();
                })
                .catch(error => {
                    if (error.response && error.response.data && error.response.data.message) {
                        alert(error.response.data.message);
                    } else {
                        alert('An unexpected error occurred');
                    }
                    observer.error(error);
                });
        });
    }

    logout(): void {
        localStorage.removeItem('authToken');
        this.router.navigate(['/landing']);
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('authToken');
    }

    getToken(): string | null {
        return localStorage.getItem('authToken');
    }
}
