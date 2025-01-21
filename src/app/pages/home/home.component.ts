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
        active: false
      }]
  constructor (private genericHttpService: GenericHttpService){}
  ngOnInit(): void {
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
                }
              } as MovieCardConfig;
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
