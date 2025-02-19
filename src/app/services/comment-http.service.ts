import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentHttpService {
  private apiUrl = 'https://movisearchapi-production.up.railway.app/api/comments';

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

  private getHeadersNull(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  get(movieId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get/${movieId}`, { headers: this.getHeadersNull() });
  }
  post(movieId: number, comment: string): Observable<any> {
    const body = { movieId, comment }; 
    return this.http.post<any>(`${this.apiUrl}/create`, body, { headers: this.getHeaders() });
  }

  deleteComment(idComment: number): Observable<any> {  
    return this.http.delete(`${this.apiUrl}/delete/comment`, {
      headers: this.getHeaders(),
      body: { id: idComment } 
    });
  }

  postLike(idCommentLike: number): Observable<any> {
    return this.http.post<any>(
        `${this.apiUrl}/like/${idCommentLike}`, 
        {},  
        { headers: this.getHeaders() } 
    );
}

}
