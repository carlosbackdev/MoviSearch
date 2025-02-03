import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AuthModalComponent } from '../../components/auth-modal/auth-modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  providers: [GenericHttpService],
  imports: [InputComponent, MovieCardComponent, HttpClientModule, SegmentedControlComponent,CommonModule, AuthModalComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  private searchTimeout: any;
  title: string ='Tendencias'
  length: number=0;
  movieCards: MovieCardConfig [] =[];
  carouselImages: string[] = [];
  currentImageIndex = 0;
  isTrendsLoaded: boolean = false; 
  isCarouselStarted: boolean = false; 
  carouselInterval: any;
  showLoginModal: boolean = false;
  
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
  constructor (private genericHttpService: GenericHttpService, private router: Router,
    private authService: AuthService
   ){}
  ngOnInit(): void {
    this.resetCarousel();
        this.getTrends();
        this.segments.map((item: SegmentedControlConfig) => {
          item.onClick = () => {
            this.title= item.name
            if (item.name.toLowerCase().includes('películas')){
              this.getMovies();
            }else if (item.name.toLowerCase().includes('series')){
              this.getSeries();
            }else if (item.name.toLowerCase().includes('todas')){
              this.getTrends();
            }
          }
        })
  }
    ngOnDestroy(): void {
    this.stopCarousel();
  }
  resetCarousel(): void {
    this.currentImageIndex = 0;
    this.isCarouselStarted = false;
    this.isTrendsLoaded = false;
    this.carouselImages = [];
    this.stopCarousel(); 
  }

  stopCarousel(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.carouselInterval = null;
    }
  }
  startCarousel(): void {
    if (this.isCarouselStarted) {
      return;
    }
    this.isCarouselStarted = true;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.carouselImages.length;
    this.updateCarouselImages();
    this.carouselInterval = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.carouselImages.length;
      this.updateCarouselImages();
    }, 4500);
  }
  updateCarouselImages(): void {
    const images = document.querySelectorAll('.carousel-item');
    images.forEach((image, index) => {
      image.classList.remove('active', 'next', 'previous');
  
      if (index === this.currentImageIndex) {
        image.classList.add('active');
      } else if (index === (this.currentImageIndex - 1 + this.carouselImages.length) % this.carouselImages.length) {
        image.classList.add('previous');
      } else if (index === (this.currentImageIndex + 1) % this.carouselImages.length) {
        image.classList.add('next');
      }
    });
  }


  itemsProcessed: number = 0;

  getTrends() {
    this.genericHttpService.tmdbGet(Endpoints.trends)
      .subscribe({
        next: (res: TrendData) => {
          console.log('Respuesta de la API:', res);
          if (res && res.results) {
            console.log(res.results);
            this.movieCards = [];
            this.itemsProcessed = 0;
            if (!this.isTrendsLoaded) {
              this.carouselImages = [];
            }
            res.results.forEach((item: TrendsResult) => {
              let movieName = item.media_type === 'tv' ? item.name : item.title;
              
              const endpoint = item.media_type === 'movie' ? Endpoints.movieTranslate(item.id.toString()) : Endpoints.serieTranslate(item.id.toString());
  
              this.genericHttpService.tmdbGet(endpoint)
                .subscribe({
                  next: (translationRes: MovieTranslationsResponse ) => {
                    if (item.media_type === 'movie') {
                      const spanishTranslation = translationRes.translations.find(
                        (t) => t.iso_639_1 === 'es' && t.iso_3166_1 === 'ES'
                      );
                      const mexicanTranslation = spanishTranslation || translationRes.translations.find(
                        (t) => t.iso_639_1 === 'es' && t.iso_3166_1 === 'MX'
                      );
                      movieName = spanishTranslation?.data.title || mexicanTranslation?.data.title || movieName;
                    } else if (item.media_type === 'tv') {
                      const spanishTranslation = translationRes.translations.find(
                        (t) => t.iso_639_1 === 'es' && t.iso_3166_1 === 'ES'
                      );
                      const mexicanTranslation = spanishTranslation || translationRes.translations.find(
                        (t) => t.iso_639_1 === 'es' && t.iso_3166_1 === 'MX'
                      );
                      movieName = spanishTranslation?.data.name || mexicanTranslation?.data.title || movieName;
                    }
                    if (item.backdrop_path) {
                      this.carouselImages.push(Endpoints.imagen + `/original/${item.backdrop_path}`);
                    } else {
                      console.log('Imagen de fondo no disponible para el item:', item);
                    }
  
                    this.movieCards.push({
                      img: Endpoints.imagen + `/w500/${item.poster_path}`,
                      tipo: item.media_type,
                      movieName: movieName , 
                      rate: item.vote_average,
                      id: item.id,  
                      onClick: () => {
                        console.log("click: ", item);
                        if (item.media_type === 'movie') {
                          this.router.navigateByUrl(`movie/${item.id}`);
                        } else if (item.media_type === 'tv') {
                          this.router.navigateByUrl(`serie/${item.id}`);
                        }
                      },onAddClick: () => { 
                        if (this.authService.isAuthenticated()) {
                          console.log("Película añadida:", item.id);
                        } else {
                          console.log("Usuario no autenticado, mostrando modal de login");
                          this.showLoginModal = true;
                        }
                      } 
                    } as MovieCardConfig);
                    this.length=this.movieCards.length;
                    this.itemsProcessed++;
                    if (this.itemsProcessed >= (res.results.length-2) && !this.isTrendsLoaded) {
                      if (!this.isCarouselStarted) {
                        this.startCarousel(); 
                      }
                      this.isTrendsLoaded = true; 
                    }
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
                      (t) => t.iso_639_1 === 'es' && t.iso_3166_1 === 'ES'
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
                      },onAddClick: () => { 
                        if (this.authService.isAuthenticated()) {
                          console.log("Película añadida:", item.id);
                        } else {
                          console.log("Usuario no autenticado, mostrando modal de login");
                          this.showLoginModal = true;
                        }
                      } 
                    } as MovieCardConfig);
                    this.length=this.movieCards.length;
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
                        (t: any) => t.iso_639_1 === 'es'&& t.iso_3166_1 === 'ES'
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
                        },onAddClick: () => { 
                          if (this.authService.isAuthenticated()) {
                            console.log("Película añadida:", item.id);
                          } else {
                            console.log("Usuario no autenticado, mostrando modal de login");
                            this.showLoginModal = true;
                          }
                        } 
                      } as MovieCardConfig);
                      this.length=this.movieCards.length;
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

  onSearchInput(query: string): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      if (query.length > 2) {
        const lowerCaseQuery = query.toLowerCase();
        this.genericHttpService.tmdbGet(Endpoints.searchMovies(lowerCaseQuery))
          .subscribe({
            next: (res: MoviesData) => {
              if (res && res.results) {
                this.movieCards = res.results.map((item: MovieResult) => ({
                  img: Endpoints.imagen + `/w500/${item.poster_path}`,
                  movieName: item.title,
                  rate: item.vote_average,
                  id: item.id,
                  onClick: () => {
                    this.router.navigateByUrl(`movie/${item.id}`);
                  },
                  onAddClick: () => { 
                    if (this.authService.isAuthenticated()) {
                      console.log("Película añadida:", item.id);
                    } else {
                      console.log("Usuario no autenticado, mostrando modal de login");
                      this.showLoginModal = true;
                    }
                  }
                } as MovieCardConfig));
                this.title ='Encontradas'
                this.length=this.movieCards.length;
              } else {
                console.error("No se encontraron resultados.");
              }
            },
            error: (error: any) => {
              console.error("Error en la búsqueda:", error);
            }
          });
      }else{
        this.getTrends();
        this.title='Tendencias'
      }
    }, 400); 
  }
  searchProcesator(query: string): void {
    if (query.length > 0) {
      this.title='Buscando...'
      this.length=0;
      const lowerCaseQuery = query.toLowerCase();
      const body = {
        phrase: lowerCaseQuery
      };
      console.log("Procesando búsqueda:", lowerCaseQuery);
      this.genericHttpService.post('http://localhost:8080/api/text/process', body).subscribe({
          next: (res: MoviesData ) => {
            if (res && res.results  && res.results.length > 0) {
              this.movieCards = res.results.map((item: MovieResult) => ({
                img: Endpoints.imagen + `/w500/${item.poster_path}`,
                movieName: item.title ?? item.name ?? "Desconocido",
                rate: item.vote_average,
                id: item.id,
                onClick: () => {
                  this.router.navigateByUrl(`movie/${item.id}`);
                },onAddClick: () => { 
                  if (this.authService.isAuthenticated()) {
                    console.log("Película añadida:", item.id);
                  } else {
                    console.log("Usuario no autenticado, mostrando modal de login");
                    this.showLoginModal = true;
                  }
                }
              } as MovieCardConfig));
              this.length=this.movieCards.length;
              this.title='recomendaciones'
            } else {
              console.error("No se encontraron resultados.");
              this.title='Sin Resultados'
            }
          },
          error: (error: any) => {
            console.error("Error en la búsqueda:", error);
            this.title='Sin Resultados'
          }
        });
    }
  }

}
