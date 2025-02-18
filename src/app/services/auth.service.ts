import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';  // Cambia esta URL si es necesario

  constructor(private http: HttpClient, private auth: Auth) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/register`, user);
  }

  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/login`, user);
  }

  confirm(user_id: number): Observable<any> {
    const body = { id: user_id };
    return this.http.post(`${this.apiUrl}/api/auth/confirm`, body);
  }

  form(name: string,mail:string,message: string){
    const body = { 
      nombre: name,
      email: mail,
      mensaje: message
    };
    return this.http.post(`${this.apiUrl}/api/form`, body);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;  
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

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(this.auth, provider);
  
    const idToken = await credential.user.getIdToken();
  
    try {
      const response: any = await this.http.post(`${this.apiUrl}/api/auth/google-login`, { idToken }).toPromise();
  
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
  
        window.location.reload();
      }
    } catch (error) {
      console.error('Error en la autenticación de Google:', error);
    }
  }

  // Eliminar el token de localStorage
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }
}