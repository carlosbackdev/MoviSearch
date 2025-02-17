import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GenericHttpService } from '../../services/generic-http.service';
import { AuthService } from '../../services/auth.service';
import { ListService } from '../../services/list.service';
import { List, Movie } from '../../interfaces/ui-config/list-user-config.interfaces';
import { MovieCardConfig } from '../../interfaces/ui-config/movie-card-config.interfaces';
import { EndpointsDiscover } from '../../endpoints/Endpoints-discover';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TrendData, TrendsResult } from '../../interfaces/models/trends.interface';
import { MovieTranslationsResponse } from '../../interfaces/models/movieTranslate.interface';
import { AuthModalComponent } from '../../components/auth-modal/auth-modal.component';
import { RecomendedBannerComponent } from "../../components/recomended-banner/recomended-banner.component";
import { AddListComponent } from '../../components/add-list/add-list.component';
import { animate, style, transition, trigger } from '@angular/animations';

type MovieCardWithId = MovieCardConfig & { id: number };

@Component({
  selector: 'app-discover',
  standalone: true,
  providers: [GenericHttpService],
  imports: [FormsModule, CommonModule, AddListComponent , MovieCardComponent, AuthModalComponent, RecomendedBannerComponent],
  templateUrl: './discover.component.html',
  styleUrl: './discover.component.scss',
  animations: [
    trigger('fadeBlur', [
      transition(':enter', [
        style({ opacity: 0, filter: 'blur(10px)' }),
        animate('1.5s ease-out', style({ opacity: 1, filter: 'blur(0)' }))
      ])
    ]),
    trigger('fadeInOnScroll', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(200px)' }),
        animate('0.8s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class DiscoverComponent {

movieLists: any[] = [];
movieIds: Map<number, number[]> = new Map();
movieCards: MovieCardWithId[] = [];
newListName: string = '';
id:number =0;
selectedMovieAndTvId: number=0;
showLoginModal: boolean = false;
imagen: string='';
recomendedBanner ={img:'',data:'',}
showListModal:boolean=false;
animationState = false;
Idlist:number=0;
showShareModal:boolean=false;


constructor(private genericHttpService: GenericHttpService,private router: Router,
   private authService: AuthService, private listService: ListService,
   private route: ActivatedRoute) {}

ngOnInit(): void { 
  this.route.paramMap.subscribe(params => {
    const category = params.get('category');
    this.updateContent(category);
    this.loadMoviesForLists();
  });
}
updateContent(category: string | null) {
this.animationState = false; // Desactiva la animación
  setTimeout(() => {
    this.animationState = true; // Reactiva la animación
  }, 10);
  if (category === 'series') {
    this.movieLists = [
      { id: 1, name: 'Nuestras Recomendaciones', movieCards: [] },
      { id: 2, name: 'Mejores Series', movieCards: [] },
      { id: 3, name: 'Estrenos de Series y Temporadas', movieCards: [] }
    ];
    this.recomendedBanner = {
      img: '',
      data: 'Nuestra Selección de Series <br> ¡Siempre actualizadas!',
    };
  } else {
    this.movieLists = [
      { id: 1, name: 'Recomendaciones', movieCards: [] },
      { id: 2, name: 'Nuevos Estrenos', movieCards: [] },
      { id: 3, name: 'Míticas', movieCards: [] }
    ];
    this.recomendedBanner = {
      img: '',
      data: 'Nuestra Selección de Películas <br> ¡Siempre actualizadas!',
    };
  }
  
}

loadMoviesForLists(): void {
  this.movieLists.forEach(list => {
    this.getMoviesForList(list);
  });
}

getMoviesForList(list: any): void {
  let endpoint = '';

  function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  const randomInt = getRandomInt(1, 20);

  switch (list.name) {
    case 'Nuevos Estrenos':
      endpoint = EndpointsDiscover.movieUp;
      break;
    case 'Recomendaciones':
      endpoint = EndpointsDiscover.moviePopular+'?page='+(randomInt+1)+'&language=es-ES';
      break;
    case 'Míticas':
      endpoint = EndpointsDiscover.movieTop;
      break;
    case 'Estrenos de Series y Temporadas':
      endpoint = EndpointsDiscover.serieUp;
      break;
    case 'Mejores Series':
      endpoint = EndpointsDiscover.serieTop;
      break;
      case 'Nuestras Recomendaciones':
        endpoint = EndpointsDiscover.serieTop+'?page='+(randomInt+1)+'&language=es-ES';
        break;
  }

  if (!endpoint) {
    return; // Evita llamadas innecesarias si no hay endpoint.
  }

  this.genericHttpService.tmdbGet(endpoint).subscribe({
    next: (res: TrendData) => {
      if (res && res.results) {
        console.log(res);
        list.movieCards = [];
        const randomItem = res.results[Math.floor(Math.random() * res.results.length)];
        this.recomendedBanner.img = EndpointsDiscover.imagen + `/original/${randomItem.backdrop_path}`;
        res.results.forEach((item: TrendsResult) => {
          const movieName = item.media_type === 'tv' ? item.name : item.title;  
          list.movieCards.push({
            img: EndpointsDiscover.imagen + `/w500/${item.poster_path}`,
            tipo: item.media_type,
            movieName: movieName,
            rate: item.vote_average,
            id: item.id,
            onClick: () => {
              if(item.name){
                this.router.navigateByUrl(`serie/${item.id}`);
              }else{
                this.router.navigateByUrl(`movie/${item.id}`);
              }
            },
            onAddClick: () => {
              if (this.authService.isAuthenticated()) {
                this.selectedMovieAndTvId = item.id;
                this.showListModal=true;
              } else {
                console.log("Usuario no autenticado, mostrando modal de login");
                this.showLoginModal = true;
              }
            }
          } as MovieCardConfig);
          
        });
      } else {
        console.error('La respuesta no contiene el campo results');
      }
    },
    error: (error: any) => {
      console.error(error);
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
