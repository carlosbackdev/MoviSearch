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

  getTrends(){
    this.genericHttpService.httpGet(Endpoints.trends)
    .subscribe({
      next: (res: TrendData) => {
        console.log('Respuesta de la API:', res);
        if (res && res.results) {
          console.log(res.results);

          this.movieCards = res.results.map((item: TrendsResult) => {
            return {
              img: Endpoints.imagen + `/w500/${item.poster_path}`,
              movieName: item.title || (item.name  !== undefined? item.name:""), // si quiero filra por pelicula debo usar el filto y quitar(item.name  !== undefined? item.name:"")
              rate: item.vote_average,
              onClick: () =>{
                console.log("click: ", item)
                if (item.media_type=="movie"){
                  this.router.navigateByUrl(`movie/${item.id}`)
                }else{                    
                    if (item.media_type=="tv"){
                      this.router.navigateByUrl(`serie/${item.id}`)
                  }
                }
              }
            } as MovieCardConfig
          }).filter((item => item.movieName))
        } else {
          console.error('La respuesta no contiene el campo result');
          this.movieCards = []; 
        }
      },
      error: (error: any) => {
        console.error(error);
      }
  })

  }

  getMovies(){
    this.genericHttpService.httpGet(Endpoints.movies)
    .subscribe({
      next: (res: MoviesData) => {
        console.log('Respuesta de la API:', res);
        if (res && res.results) {
          console.log(res.results);

          this.movieCards = res.results.map((item: MovieResult) => {
            return {
              img: Endpoints.imagen + `/w500/${item.poster_path}`,
              movieName: item.title,
              rate: item.vote_average,
              onClick: () =>{
                  this.router.navigateByUrl(`movie/${item.id}`)
              }
            } as MovieCardConfig
          }).filter((item => item.movieName))
        } else {
          console.error('La respuesta no contiene el campo result');
          this.movieCards = []; 
        }
      },
      error: (error: any) => {
        console.error(error);
      }
  })
  }

  getSeries(){
    this.genericHttpService.httpGet(Endpoints.series)
    .subscribe({
      next: (res: SeriesData) => {
        console.log('Respuesta de la API:', res);
        if (res && res.results) {
          console.log(res.results);

          this.movieCards = res.results.map((item: SerieResult) => {
            return {
              img: Endpoints.imagen + `/w500/${item.poster_path}`,
              movieName: item.name,
              rate: item.vote_average,
              onClick: () =>{
                console.log("click: ", item)

                  this.router.navigateByUrl(`serie/${item.id}`)

              }
            } as MovieCardConfig
          }).filter((item => item.movieName))
        } else {
          console.error('La respuesta no contiene el campo result');
          this.movieCards = []; 
        }
      },
      error: (error: any) => {
        console.error(error);
      }
  })
    
  }

}
