import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenericHttpService {
  baseUrl: string = 'htpps://api.themoviedb.org/3/'
  constructor(private httpClient: HttpClient) { }

  httpGet (url: string): any{
    return  this.httpClient.get<any>(`${this.baseUrl}/${url}`,{
      headers: {
        'Authorization': `Bearer ${environment.Token}`
      }
    });
  }


}
