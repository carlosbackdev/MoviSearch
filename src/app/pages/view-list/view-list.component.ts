import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { ShareListComponent } from '../../components/share-list/share-list.component';
import { GenericHttpService } from '../../services/generic-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ListService } from '../../services/list.service';
import { MovieCardConfig } from '../../interfaces/ui-config/movie-card-config.interfaces';
import { Endpoints } from '../../endpoints/Endpoints';
import { List, Movie } from '../../interfaces/ui-config/list-user-config.interfaces';
import { MovieResult, MoviesData } from '../../interfaces/models/movies.interface';
import { MovieTranslationsResponse } from '../../interfaces/models/movieTranslate.interface';
import { AuthModalComponent } from "../../components/auth-modal/auth-modal.component";
import { AddListComponent } from "../../components/add-list/add-list.component";

type MovieCardWithId = MovieCardConfig & { id: number };


@Component({
  selector: 'app-view-list',
  imports: [FormsModule, CommonModule, MovieCardComponent, ShareListComponent, AuthModalComponent, AddListComponent],
  templateUrl: './view-list.component.html',
  styleUrl: './view-list.component.scss'
})
export class ViewListComponent implements OnInit{
  userLists: any [] =  [];
  movieIds: Map<number, number[]> = new Map();
  movieCards: MovieCardWithId[] = [];
  newListName: string = '';
  id:number =0;
  Idlist:number=0;
  showListModal:boolean=false;
  username: string='';
  showSuccessMessage = false;
  selectedMovieAndTvId: number=0;
  showLoginModal:boolean=false;
  showListMovieModal:boolean=false;  

  constructor(private genericHttpService: GenericHttpService,private router: Router,
     private authService: AuthService, private listService: ListService,
     private route: ActivatedRoute) {}

    ngOnInit(): void {
      const idFromUrl = this.route.snapshot.paramMap.get('id');
      if (idFromUrl !== null) {
        this.Idlist = +idFromUrl; 
      }
      this.getLists();
    }

    getLists(): void {
      this.listService.getList(this.Idlist).subscribe(
        (list: { 
          id: number;
          name: string 
          user: { username: string } 
          movies: number[] }) => {

          this.username = list.user.username || 'Usuario desconocido';

          this.userLists = [{
            id: list.id,
            name: list.name, 
            movies: list.movies,
            movieCards: []
          }];
          
          list.movies.forEach(movieId => {
            this.getMovies(movieId, this.Idlist);
          });
    
          console.log("Lista recibida:", list);
        },
        (error) => {
          console.error("Error al obtener la lista:", error);
        }
      );
    }
    
    getMovies(movieId: number, listId: number ) {
      this.genericHttpService.tmdbGet(Endpoints.movieId(movieId.toString())).subscribe({
         next: (movieDetails: any) => {
           this.genericHttpService.tmdbGet(Endpoints.movieTranslate(movieId.toString())).subscribe({
             next: (translationRes: any) => {
               const spanishTranslation = translationRes.translations.find(
                 (t: any) => t.iso_639_1 === 'es' && t.iso_3166_1 === 'ES'
               );
               const mexicanTranslation = spanishTranslation || translationRes.translations.find(
                 (t: any) => t.iso_639_1 === 'es' && t.iso_3166_1 === 'MX'
               );
     
               const movieName = spanishTranslation?.data.title || mexicanTranslation?.data.title || movieDetails.title;
     
               const movieCard: MovieCardWithId = {
                 img: Endpoints.imagen + `/w500/${movieDetails.poster_path}`,
                 movieName: movieName,
                 rate: movieDetails.vote_average,
                 id: movieId,
                 onClick: () => {
                   console.log("click: ", movieDetails);
                     this.router.navigateByUrl(`movie/${movieDetails.id}`);              
                 },onAddClick: () => { 
                  if (this.authService.isAuthenticated()) {
                    this.selectedMovieAndTvId= movieId;
                    this.showListMovieModal=true;
                  } else {
                    console.log("Usuario no autenticado, mostrando modal de login");
                    this.showLoginModal = true;
                  }
                } 
               };
               if (!movieDetails.poster_path || movieDetails.popularity<10 || !movieDetails.backdrop_path ){
                 this.getSerieDetails(movieId, this.Idlist);
                 return;
               };
     
               const list = this.userLists.find(l => l.id === listId);
               if (list) {
                 if (!list.movieCards) {
                   list.movieCards = [];
                 }
                 list.movieCards.push(movieCard);
               }
             },
             error: (err: any) => {
               console.error('Error al obtener la traducción de la película:', err);
             }
           });
         },
         error: (error: any) => {
           console.error('Error al obtener los detalles de la película:', error);
           this.getSerieDetails(movieId, listId);
         }
       });
    }
    getSerieDetails(seriesId: number, listId: number): void {
      this.genericHttpService.tmdbGet(Endpoints.serieId(seriesId.toString())).subscribe({
        next: (serieDetails: any) => {
          this.genericHttpService.tmdbGet(Endpoints.serieTranslate(seriesId.toString())).subscribe({
            next: (translationRes: any) => {
              const spanishTranslation = translationRes.translations.find(
                (t: any) => t.iso_639_1 === 'es' && t.iso_3166_1 === 'ES'
              );
              const mexicanTranslation = spanishTranslation || translationRes.translations.find(
                (t: any) => t.iso_639_1 === 'es' && t.iso_3166_1 === 'MX'
              );
              const serieName = spanishTranslation?.data.name || mexicanTranslation?.data.name || serieDetails.name;
              const serieCard: MovieCardWithId = {
                img: Endpoints.imagen + `/w500/${serieDetails.poster_path}`,
                movieName: serieName,
                rate: serieDetails.vote_average,
                id: seriesId,
                onClick: () => {
                  console.log("click: ", serieDetails);
                  this.router.navigateByUrl(`serie/${serieDetails.id}`);
                },onAddClick: () => { 
                  if (this.authService.isAuthenticated()) {
                    this.selectedMovieAndTvId= seriesId;
                    this.showListMovieModal=true;
                  } else {
                    console.log("Usuario no autenticado, mostrando modal de login");
                    this.showLoginModal = true;
                  }
                } 
              };
              const list = this.userLists.find(l => l.id === listId);
              if (list) {
                if (!list.movieCards) {
                  list.movieCards = [];
                }
                list.movieCards.push(serieCard);
              }
            },
            error: (err: any) => {
              console.error('Error al obtener la traducción de la serie:', err);
            }
          });
        },
        error: (error: any) => {
          console.error('Error al obtener los detalles de la serie:', error);
        }
      });
    }
    
    

  shareList(listId: number): void {
    this.Idlist=listId;
    this.showListModal=true;
  }
  
  addList(): void {
    if (this.authService.isAuthenticated()) {
      this.listService.copyList(this.Idlist).subscribe(
        response => {
          console.log('Lista copiada con éxito:', response);
          this.showSuccessMessage = true;
        },
        error => {
          console.error('Error al copiar la lista:', error);
          this.showSuccessMessage = true; 
        }
      );
    } else {
      console.log("Usuario no autenticado, mostrando modal de login");
      this.showLoginModal = true;
    }
  }


  scrollLeft(container: HTMLElement): void {
    const screenWidth = window.innerWidth;
    const scrollAmount = screenWidth < 650 ? 300 : 800;  
    
    container.scrollTo({
      left: container.scrollLeft - scrollAmount,  
      behavior: 'smooth'  
    });
  }
  
  scrollRight(container: HTMLElement): void {
    const screenWidth = window.innerWidth;
    const scrollAmount = screenWidth < 650 ? 300 : 800; 
    
    container.scrollTo({
      left: container.scrollLeft + scrollAmount,  
      behavior: 'smooth'  
    });
  }
  
}
