import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
  username: string;
}

const TOKEN_KEY = 'crm_token';
const USER_KEY = 'crm_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  // Signals so the nav bar updates instantly on login/logout
  private token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  username = signal<string | null>(localStorage.getItem(USER_KEY));
  isLoggedIn = computed(() => this.token() !== null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { username, password }).pipe(
      tap(res => {
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, res.username);
        this.token.set(res.token);
        this.username.set(res.username);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.token.set(null);
    this.username.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.token();
  }
}