import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YtsService {
  private apiUrl = 'https://yts.mx/api/v2/movie_details.json';

  constructor(private http: HttpClient) {}

  getMovieDetails(imdbId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?imdb_id=${imdbId}`);
  }
}
