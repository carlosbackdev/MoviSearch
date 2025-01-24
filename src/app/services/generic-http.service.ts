import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenericHttpService {
  baseUrl: string = 'https://api.themoviedb.org/3/';
  apiKey: string = environment.tmdbApiKey;
  constructor(private httpClient: HttpClient) { }

  tmdbGet (url: string): any{
    return  this.httpClient.get<any>(`${this.baseUrl}/${url}`,{
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NGRlZTNlNTczYmFlMmFjZDgwNGMxMGRmNzdiYjg2OSIsIm5iZiI6MTczNjgwNjY5Ni44MjcwMDAxLCJzdWIiOiI2Nzg1OTEyODYwMWFjZmU3YmQ0ZjYxODkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.vNWwDkoYHxuqsRaKbbK1RM6Zq--0T6i0w7hPUnp2dAk'
      }
    });
  }


}
