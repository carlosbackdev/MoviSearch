import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GenericHttpService } from '../../services/generic-http.service';
import { AuthService } from '../../services/auth.service';
import { ListService } from '../../services/list.service';
import { List, Movie } from '../../interfaces/ui-config/list-user-config.interfaces';
import { MovieCardConfig } from '../../interfaces/ui-config/movie-card-config.interfaces';
import { Endpoints } from '../../endpoints/Endpoints';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { AddListComponent } from "../../components/add-list/add-list.component";
import { ShareListComponent } from "../../components/share-list/share-list.component";

type MovieCardWithId = MovieCardConfig & { id: number };
@Component({
  selector: 'app-list',
  imports: [FormsModule, CommonModule, MovieCardComponent, ShareListComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  animations: [
    trigger('fadeIn', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('1s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})

export class ListComponent {

userLists: any [] =  [];
movieIds: Map<number, number[]> = new Map();
movieCards: MovieCardWithId[] = [];
newListName: string = '';
id:number =0;
Idlist:number=0;
showListModal:boolean=false;


constructor(private genericHttpService: GenericHttpService,private router: Router,
   private authService: AuthService, private listService: ListService) {}

ngOnInit(): void { 
  this.getUserLists();
}

getUserLists(): void {
  this.listService.getMovieLists().subscribe(
    (lists: List[]) => {
      this.userLists = lists;
      this.movieIds = new Map(
        lists.map(list => [list.id, list.movies.map(movie => movie.movieId)])
      );
      lists.forEach(list => {
        list.movies.forEach(movie => {
          this.getMovieDetails(movie.movieId, list.id);
        });
      });

      console.log(lists);
      console.log(this.movieIds);
    },
    (error) => {
      console.error('Error al obtener listas:', error);
      localStorage.clear();
      window.location.reload();
    }
  );
}
getMovieDetails(movieId: number, listId: number): void {
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
            },
          };
          if (!movieDetails.poster_path || movieDetails.popularity<10 || !movieDetails.backdrop_path ){
            this.getSerieDetails(movieId, listId);
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
            },
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
  
  createList(): void {
    for(let i=0;i<this.userLists.length;i++){
      if(this.newListName.trim().toLowerCase() === this.userLists[i].name){ 
        return;
      }
    }
    console.log('Enviando lista:', this.newListName);  
    if (!this.newListName.trim().toLowerCase()) {
        console.warn('El nombre de la lista no puede estar vacío.');
        return;
    }

    this.listService.createList(this.newListName.trim().toLowerCase()).subscribe(
        (response) => {
            console.log('Lista creada:', response);
            this.getUserLists(); 
            this.newListName = ''; 
        },
        (error) => {
            console.error('Error al crear la lista:', error);
            console.error('Error details:', error.error);
        }
    );
}
deleteList(listName: string): void {
    console.log(listName);
    this.listService.deleteListUser(listName).subscribe(
      () => {
        this.getUserLists();
        console.log(`Lista ${listName} eliminada`);
      },
      (error) => {
        console.error('Error al eleminar la lista:', error);
      }
    );
  }

  shareList(listId: number): void {
    this.Idlist=listId;
    this.showListModal=true;
  }

  deleteMovieOrSerie(movieId: number, listId: number): void {
    console.log(` lista: ${listId}: ID ${movieId}`);
    this.listService.deleteMovieFromList(movieId, listId).subscribe({
      next: () => {
        console.log(`Eliminado correctamente de la lista ${listId}: ID ${movieId}`);
        this.getUserLists();
      },
      error: (err) => {
        console.error('Error al eliminar la película/serie:', err);
      }
    });
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
