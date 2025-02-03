import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';  // Cambia esta URL si es necesario

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/register`, user);
  }

  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/login`, user);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;  // Retorna true si hay un token en localStorage
  }

  // Guardar el token en localStorage
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  makeAuthenticatedRequest(url: string): Observable<any> {
    return this.http.get(url, { headers: this.getAuthHeaders() });
  }

  getAuthHeaders() {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Eliminar el token de localStorage
  logout(): void {
    localStorage.removeItem('token');
  }
}