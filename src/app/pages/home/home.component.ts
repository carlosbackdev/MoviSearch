import { Component, OnInit } from '@angular/core';
import { InputComponent } from '../../components/input/input.component';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { GenericHttpService } from '../../services/generic-http.service';
import { HttpClientModule } from '@angular/common/http';
import { Endpoints } from '../../endpoints/Endpoints';
import { TrendData, TrendsResult } from '../../interfaces/models/trends.interface';
import { MovieCardConfig } from '../../interfaces/ui-config/movie-card-config.interfaces';
import { SegmentedControlComponent } from '../../components/segmented-control/segmented-control.component';
import { SegmentedControlConfig } from '../../interfaces/ui-config/segmented-control-component.interfaces';
import { Router } from '@angular/router';
import { MovieResult, MoviesData } from '../../interfaces/models/movies.interface';
import { SerieResult, SeriesData } from '../../interfaces/models/series.interface';
import { RateChipComponent } from '../../components/rate-chip/rate-chip.component';
import { MovieTranslationsResponse } from '../../interfaces/models/movieTranslate.interface';
import { SeriesTranslations } from '../../interfaces/models/serieTranslate.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  providers: [GenericHttpService],
  imports: [InputComponent, MovieCardComponent, HttpClientModule, SegmentedControlComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  title: string ='Tendencias'
  movieCards: MovieCardConfig [] =[];
    segments: SegmentedControlConfig[] = [
      {
      name:'Todas',
      active: true
      },
      {
        name:'Películas',
        active: false
      },
      {
        name:'Series',
        active: false,
      }]
  constructor (private genericHttpService: GenericHttpService, private router: Router ){}
  ngOnInit(): void {
    this.segments.map((item: SegmentedControlConfig) => {
      item.onClick = () => {
        this.title= item.name
        if (item.name.toLowerCase().includes('películas')){
          this.getMovies();
        }else if (item.name.toLowerCase().includes('series')){
          this.getSeries();
        }else{
          this.getTrends();
        }
      }
    })
    this.getTrends() 
  }

  getTrends() {
    this.genericHttpService.tmdbGet(Endpoints.trends)
      .subscribe({
        next: (res: TrendData) => {
          console.log('Respuesta de la API:', res);
          if (res && res.results) {
            console.log(res.results);
  
            this.movieCards = [];
            res.results.forEach((item: TrendsResult) => {
              let movieName = item.media_type === 'tv' ? item.name : item.title;
              
              const endpoint = item.media_type === 'movie' ? Endpoints.movieTranslate(item.id.toString()) : Endpoints.serieTranslate(item.id.toString());
  
              this.genericHttpService.tmdbGet(endpoint)
                .subscribe({
                  next: (translationRes: MovieTranslationsResponse) => {
                    if (item.media_type === 'movie') {
                      // Para películas, manejamos las traducciones
                      const spanishTranslation = translationRes.translations.find(
                        (t) => t.iso_639_1 === 'es'
                      );
                      const mexicanTranslation = spanishTranslation || translationRes.translations.find(
                        (t) => t.iso_639_1 === 'es' && t.iso_3166_1 === 'MX'
                      );
                      movieName = spanishTranslation?.data.title || mexicanTranslation?.data.title || movieName;
                    } else if (item.media_type === 'tv') {
                      // Para series, manejamos las traducciones
                      const spanishTranslation = translationRes.translations.find(
                        (t) => t.iso_639_1 === 'es'
                      );
                      const mexicanTranslation = spanishTranslation || translationRes.translations.find(
                        (t) => t.iso_639_1 === 'es' && t.iso_3166_1 === 'MX'
                      );
                      movieName = spanishTranslation?.data.title || mexicanTranslation?.data.title || movieName;
                    }
  
                    this.movieCards.push({
                      img: Endpoints.imagen + `/w500/${item.poster_path}`,
                      tipo: item.media_type,
                      movieName: movieName, 
                      rate: item.vote_average,
                      id: item.id,  
                      onClick: () => {
                        console.log("click: ", item);
                        if (item.media_type === 'movie') {
                          this.router.navigateByUrl(`movie/${item.id}`);
                        } else if (item.media_type === 'tv') {
                          this.router.navigateByUrl(`serie/${item.id}`);
                        }
                      }
                    } as MovieCardConfig);
                  },
                  error: (err: any) => {
                    console.error('Error al obtener la traducción de la película/serie:', err);
                  }
                });
            });
  
          } else {
            console.error('La respuesta no contiene el campo result');
            this.movieCards = [];
          }
        },
        error: (error: any) => {
          console.error(error);
        }
      });
  }
  

  getMovies() {
    this.genericHttpService.tmdbGet(Endpoints.movies)
      .subscribe({
        next: (res: MoviesData) => {
          console.log('Respuesta de la API:', res);
          if (res && res.results) {
            console.log(res.results);

            this.movieCards = [];
            res.results.forEach((item: MovieResult) => {
              this.genericHttpService.tmdbGet(Endpoints.movieTranslate(item.id.toString()))
                .subscribe({
                  next: (translationRes: MovieTranslationsResponse) => {
                    const spanishTranslation = translationRes.translations.find(
                      (t) => t.iso_639_1 === 'es'
                    );
                      const mexicanTranslation = spanishTranslation || translationRes.translations.find(
                      (t) => t.iso_639_1 === 'es' && t.iso_3166_1 === 'MX'
                    );
  
                    const movieName = spanishTranslation?.data.title || mexicanTranslation?.data.title || item.title;
  
                  
                    this.movieCards.push({
                      img: Endpoints.imagen + `/w500/${item.poster_path}`,
                      movieName: movieName,
                      rate: item.vote_average,
                      id: item.id,  
                      onClick: () => {
                        this.router.navigateByUrl(`movie/${item.id}`);
                      }
                    } as MovieCardConfig);
                  },
                  error: (err: any) => {
                    console.error('Error al obtener la traducción de la película:', err);
                  }
                });
            });
  
          } else {
            console.error('La respuesta no contiene el campo result');
            this.movieCards = [];
          }
        },
        error: (error: any) => {
          console.error('Error al obtener las películas:', error);
        }
      });
  }
  

  getSeries() {
    this.genericHttpService.tmdbGet(Endpoints.series)
      .subscribe({
        next: (res: SeriesData) => {
          console.log('Respuesta de la API:', res);
          if (res && res.results) {
            console.log(res.results);
            this.movieCards = [];
            res.results.forEach((item: SerieResult) => {
              this.genericHttpService.tmdbGet(Endpoints.serieTranslate(item.id.toString()))
                .subscribe({
                  next: (translationRes: any) => { 
                    if (translationRes && translationRes.translations) {
                      const spanishTranslation = translationRes.translations.find(
                        (t: any) => t.iso_639_1 === 'es'
                      );
  
                      const mexicanTranslation = spanishTranslation || translationRes.translations.find(
                        (t: any) => t.iso_639_1 === 'es' && t.iso_3166_1 === 'MX'
                      );
  
                      const seriesName = spanishTranslation?.data.name || mexicanTranslation?.data.name || item.name;
  
                      this.movieCards.push({
                        img: Endpoints.imagen + `/w500/${item.poster_path}`,
                        movieName: seriesName,
                        rate: item.vote_average,
                        id: item.id,  
                        onClick: () => {
                          console.log("click: ", item);
                          this.router.navigateByUrl(`serie/${item.id}`);
                        }
                      } as MovieCardConfig);
                    } else {
                      console.error('No se encontraron traducciones para la serie:', item.name);
                    }
                  },
                  error: (err: any) => {
                    console.error('Error al obtener la traducción de la serie:', err);
                  }
                });
            });
  
          } else {
            console.error('La respuesta no contiene el campo result');
            this.movieCards = [];
          }
        },
        error: (error: any) => {
          console.error('Error al obtener las series:', error);
        }
      });
  }
  

}
