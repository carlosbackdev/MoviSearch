import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private apiUrl = 'http://localhost:8080/api/lists';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getUserLists(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`, { headers: this.getHeaders() });
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
  

}
