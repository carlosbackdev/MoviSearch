import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private apiUrl = 'https://movisearchapi-production.up.railway.app/api/lists';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Solo agregar la cabecera Authorization si el token existe
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }
  
  getUserLists(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`, { headers: this.getHeaders() });
  }

  getList(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/share/${id}`, { headers: this.getHeaders() });
  }

  getMovieLists(): Observable<any> {
    return this.http.get(`${this.apiUrl}/movie`, { headers: this.getHeaders() });
  }

  createList(listName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, { name: listName }, { headers: this.getHeaders() });
  }

  addMovieToList(listName: string, movieId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/add-movie`,
      { listName, movieId },
      { headers: this.getHeaders() }
    );
  }
  deleteListUser(listName: string): Observable<any> {  
    return this.http.delete(`${this.apiUrl}/delete`, {
      headers: this.getHeaders(),
      body: { name: listName } 
    });
  }
  deleteMovieFromList(movieId: number, listId: number): Observable<any> {
    console.log("Enviando JSON:", JSON.stringify); 
    console.log("Token que se enviará:", this.getHeaders());
    return this.http.delete(`${this.apiUrl}/delete/movie`, {
      headers: this.getHeaders(),
      body: { movieId, listId }
    });
  }
  copyList(listId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/copy`,
      { listId: listId }, 
      { headers: this.getHeaders() }
    );
  }

}
