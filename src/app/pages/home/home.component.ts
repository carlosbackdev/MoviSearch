import { Component, OnInit, OnDestroy } from '@angular/core';
import { forkJoin } from 'rxjs';
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
import { AddListComponent } from "../../components/add-list/add-list.component";
import { OpenAiService } from '../../services/open-ai.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { EndpointsDiscover } from '../../endpoints/Endpoints-discover';


@Component({
  selector: 'app-home',
  standalone: true,
  providers: [GenericHttpService],
  imports: [InputComponent, MovieCardComponent, HttpClientModule, SegmentedControlComponent, CommonModule, AuthModalComponent, FormsModule, AddListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
     animations: [
      trigger('img', [
        transition(':enter', [
          style({ opacity: 0, filter: 'blur(10px)' }),
          animate('1.3s ease-out', style({ opacity: 1, filter: 'blur(0)' }))
        ])
      ]),
      trigger('navbar', [
        transition(':enter', [
          style({ opacity: 0, filter: 'blur(0px)' }),
          animate('1s ease-in', style({ opacity: 1, filter: 'blur(0)' }))
        ])
      ]),
    ]
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
  showListModal: boolean = false;
  selectedMovieAndTvId: number=0;
  chat: string ='';
  chatLines: string[] = [];
  isLoading: boolean = false;
  isSearch: boolean = false;
  queryRepeat: string='';
  
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
    private authService: AuthService,
    private openAiService: OpenAiService,
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
                          this.selectedMovieAndTvId= item.id;
                          this.showListModal=true;
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
            res.results.forEach((item: MovieResult, index: number) => {
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
  
                    setTimeout(() => {
                    this.movieCards.push({
                      img: Endpoints.imagen + `/w500/${item.poster_path}`,
                      movieName: movieName,
                      rate: item.vote_average,
                      id: item.id,  
                      onClick: () => {
                        this.router.navigateByUrl(`movie/${item.id}`);
                      },onAddClick: () => { 
                        if (this.authService.isAuthenticated()) {
                          this.selectedMovieAndTvId= item.id;
                          this.showListModal=true;
                        } else {
                          console.log("Usuario no autenticado, mostrando modal de login");
                          this.showLoginModal = true;
                        }
                      } 
                    } as MovieCardConfig); 
                    this.length=this.movieCards.length;
                   }, index * 50);
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
            res.results.forEach((item: SerieResult, index: number) => {
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
                      setTimeout(() => {
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
                            this.selectedMovieAndTvId= item.id;
                            this.showListModal=true;
                          } else {
                            console.log("Usuario no autenticado, mostrando modal de login");
                            this.showLoginModal = true;
                          }
                        } 
                      } as MovieCardConfig);
                      this.length=this.movieCards.length; 
                     }, index * 50);                      
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
    this.title = 'Encontradas';
    this.length=0;
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      if (query.length > 2) {
        const lowerCaseQuery = query.toLowerCase();
        this.genericHttpService.tmdbGet(Endpoints.searchMovies(lowerCaseQuery))
          .subscribe({
            next: (res: MoviesData) => {
              console.log('Respuesta de la API:', res);
              if (res && res.results) {
                console.log(res.results);
  
                this.movieCards = [];
                res.results.forEach((item: MovieResult, index: number) => {
                  // Verificar si el poster_path es null
                  if (item.poster_path) {
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
                          setTimeout(() => {
                          this.movieCards.push({
                            img: Endpoints.imagen + `/w500/${item.poster_path}`,
                            movieName: movieName,
                            rate: item.vote_average,
                            id: item.id,
                            onClick: () => {
                              this.router.navigateByUrl(`movie/${item.id}`);
                            },
                            onAddClick: () => {
                              if (this.authService.isAuthenticated()) {
                                this.selectedMovieAndTvId = item.id;
                                this.showListModal = true;
                              } else {
                                console.log("Usuario no autenticado, mostrando modal de login");
                                this.showLoginModal = true;
                              }
                            }
                          } as MovieCardConfig);
                          this.length = this.movieCards.length;
                          }, index * 250);
                          if (this.movieCards.length < 10) {
                            this.onSearchInputTv(query);
                          }
                        },
                        error: (err: any) => {
                          console.error('Error al obtener la traducción de la película:', err);
                        }
                      });
                  } else {
                    console.log(`Película ${item.title} omitida por no tener poster.`);
                  }
                });
  
              } else {
                console.error('La respuesta no contiene el campo result');
                this.movieCards = [];
                this.onSearchInputTv(query);
                this.titulo();
              }
            },
            error: (error: any) => {
              console.error("Error en la búsqueda:", error);
              this.movieCards = [];
              this.onSearchInputTv(query);
            }
          });
      } else {
        this.getTrends();
        this.title = 'Tendencias';
      }    this.titulo();
    }, 400);
  }
  
  onSearchInputTv(query: string): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      if (query.length > 2) {
        const lowerCaseQuery = query.toLowerCase();
        this.genericHttpService.tmdbGet(Endpoints.searchSeries(lowerCaseQuery))
          .subscribe({
            next: (res: MoviesData) => {
              console.log('Respuesta de la API:', res);
              if (res && res.results) {
                console.log(res.results);
  
                res.results.forEach((item: MovieResult , index: number) => {
                  // Verificar si el poster_path es null
                  if (item.poster_path) {
                    this.genericHttpService.tmdbGet(Endpoints.serieTranslate(item.id.toString()))
                      .subscribe({
                        next: (translationRes: MovieTranslationsResponse) => {
                          const spanishTranslation = translationRes.translations.find(
                            (t) => t.iso_639_1 === 'es' && t.iso_3166_1 === 'ES'
                          );
                          const mexicanTranslation = spanishTranslation || translationRes.translations.find(
                            (t) => t.iso_639_1 === 'es' && t.iso_3166_1 === 'MX'
                          );
  
                          const movieName = spanishTranslation?.data.name || mexicanTranslation?.data.name || item.name;
  
                          this.movieCards.push({
                            img: Endpoints.imagen + `/w500/${item.poster_path}`,
                            movieName: movieName,
                            rate: item.vote_average,
                            id: item.id,
                            onClick: () => {
                              this.router.navigateByUrl(`serie/${item.id}`);
                            },
                            onAddClick: () => {
                              if (this.authService.isAuthenticated()) {
                                this.selectedMovieAndTvId = item.id;
                                this.showListModal = true;
                              } else {
                                console.log("Usuario no autenticado, mostrando modal de login");
                                this.showLoginModal = true;
                              }
                            }
                          } as MovieCardConfig);
                          this.length = this.movieCards.length;
                        },
                        error: (err: any) => {
                          console.error('Error al obtener la traducción de la película:', err);
                        }
                      });
                  } else {
                    console.log(`Serie ${item.name} omitida por no tener poster.`);
                  }
                });
  
              } else {
                console.error('La respuesta no contiene el campo result');
                this.titulo();
              }
            },
            error: (error: any) => {
              console.error("Error en la búsqueda:", error);
            }
          });
      } else {
        this.getTrends();
        this.title = 'Tendencias';
      }
    }, 400);
  }
  titulo(){
    if(this.length<1 || this.length ){
      this.title = 'Sin resultados';
    }
  }

  searchProcesator(query: string): void {
    this.queryRepeat=query;
    this.isSearch=true;
    this.isLoading = true;
    if (query.length > 2) {
      this.title = 'Buscando...';
      this.length = 0;
      const lowerCaseQuery = query.toLowerCase();
      const body = { phrase: lowerCaseQuery };

      console.log("Procesando búsqueda:", lowerCaseQuery);
      const isSeriesSearch = /(serie|series|tv|shows)/.test(lowerCaseQuery);

      forkJoin({
        movieSearch: this.genericHttpService.post('https://movisearchapi-production.up.railway.app/api/text/process', body),
        chatbotResponse: this.openAiService.getChatbotResponse(query)
      }).subscribe({
        next: ({ movieSearch, chatbotResponse }) => {
          if (movieSearch?.results?.length > 0) {
            this.movieCards = [];

             movieSearch.results.forEach((item: any, index: number) => {
            setTimeout(() => {
              this.movieCards.push({
                img: Endpoints.imagen + `/w500/${item.poster_path}`,
                movieName: item.title ?? item.name ?? "Desconocido",
                rate: item.vote_average,
                id: item.id,
                onClick: () => {
                  if (isSeriesSearch) {
                    this.router.navigateByUrl(`serie/${item.id}`);
                  } else {
                    this.router.navigateByUrl(`movie/${item.id}`);
                  }
                },
                onAddClick: () => {
                  if (this.authService.isAuthenticated()) {
                    this.selectedMovieAndTvId = item.id;
                    this.showListModal = true;
                  } else {
                    console.log("Usuario no autenticado, mostrando modal de login");
                    this.showLoginModal = true;
                  }
                }
              });

              // Actualizar la longitud de las tarjetas después de agregar cada una
              this.length = this.movieCards.length;

              // Mostrar el texto después de un pequeño retraso
              if (index === movieSearch.results.length - 1) {
                this.title = 'Recomendaciones';
                this.isLoading = false;
              }
            }, index * 100); 
          });
            const movieIds = movieSearch.results.map((item: any) => item.id);            
            this.saveQuery(movieIds, chatbotResponse.response);
            console.log(chatbotResponse.response);
            const numberMatch = chatbotResponse.response.match(/^(\d+):/);
            let extractedText = chatbotResponse.response;              
            if (numberMatch) {
              extractedText = extractedText.replace(/^(\d+):\s*/, '');
              this.chat=extractedText;
            }
            console.log("Texto sin el número:", this.chat);
            console.log(movieSearch);
            this.length = this.movieCards.length;
            this.title = 'Recomendaciones';
            this.isLoading = false;

          } else {
            console.error("No se encontraron resultados.");
            this.title = 'Sin Resultados';
            this.isLoading = false;

          }

          console.log("Respuesta del chatbot:", chatbotResponse.response);
        },
        error: (error: any) => {
          console.error("Error en la búsqueda o chatbot:", error);
          this.title = 'Sin Resultados';
          this.isLoading = false;
        }
      });
    }
  }

  moreSearch():void{
    this.searchProcesator(this.queryRepeat);
  }

  saveQuery(movieIds: number[], response: string): void {
    const numberMatch = response.match(/^(\d+):/);

    if (numberMatch) {
      const number = parseInt(numberMatch[1], 10);
      console.log(number);
      this.openAiService.updateChatHistory(number, movieIds).subscribe({
        next: (response) => {
          console.log('Chat history updated successfully:', response);
        },
        error: (error) => {
          console.error('Error updating chat history:', error);
        }
      });
    } else {
      console.error('No number found in response');
    }
  }
  
  
  
  random(): void{
    function getRandomInt(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const randomInt = getRandomInt(1, 50);
    let endpoint = '';
    if(randomInt % 2 === 0){
      endpoint = EndpointsDiscover.moviePopular+'?page='+(randomInt+1)+'&language=es-ES';
    }else{
      endpoint = EndpointsDiscover.serieTop+'?page='+(randomInt+1)+'&language=es-ES';
    }
    this.getMovieAzar(endpoint);   
  }
  getMovieAzar(endpoint: string) {
    this.genericHttpService.tmdbGet(endpoint)
      .subscribe({
        next: (res: MoviesData) => {
          console.log('Respuesta de la API:', res);
          if (res && res.results) {
            console.log(res.results);

            this.movieCards = [];
            res.results.forEach((item: MovieResult, index: number) => {
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
  
                    setTimeout(() => {
                    this.movieCards.push({
                      img: Endpoints.imagen + `/w500/${item.poster_path}`,
                      movieName: movieName,
                      rate: item.vote_average,
                      id: item.id,  
                      onClick: () => {
                        this.router.navigateByUrl(`movie/${item.id}`);
                      },onAddClick: () => { 
                        if (this.authService.isAuthenticated()) {
                          this.selectedMovieAndTvId= item.id;
                          this.showListModal=true;
                        } else {
                          console.log("Usuario no autenticado, mostrando modal de login");
                          this.showLoginModal = true;
                        }
                      } 
                    } as MovieCardConfig); 
                    this.length=this.movieCards.length;
                   }, index * 50);
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

}
