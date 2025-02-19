import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {
  private apiUrl = 'https://movisearchapi-production.up.railway.app/api/chatbot';

  constructor(private http: HttpClient) { }

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

  // Método para obtener la respuesta del chatbot
  getChatbotResponse(query: string): Observable<any> {
    const params = new HttpParams().set('phrase', query);
    
    return this.http.get<any>(this.apiUrl, {
      headers: this.getHeaders(),
      params: params
    });
  }
  updateChatHistory(chatId: number, movieIds: number[]): Observable<any> {
    const body = { movieIds };

    return this.http.put<any>(
      `${this.apiUrl}/update/${chatId}`,
      body
    );
  }
}
