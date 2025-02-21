import { Injectable } from '@angular/core';
import { MovieCardConfig } from '../interfaces/ui-config/movie-card-config.interfaces';

@Injectable({
  providedIn: 'root',
})
export class MovieStateService {
  title: string = 'Tendencias';
  length: number=0;
  movieCards: MovieCardConfig[] = [];
  carouselImages: string[] = []; 
  isInitialized: boolean = false;

  setInitialized(): void {
    this.isInitialized = true;
  }
}