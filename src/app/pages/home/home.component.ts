import { Component, OnInit } from '@angular/core';
import { InputComponent } from '../../components/input/input.component';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { GenericHttpService } from '../../services/generic-http.service';
import { HttpClientModule } from '@angular/common/http';
import { Endpoints } from '../../endpoints/Endpoints';
import { TrendData, TrendsResult } from '../../interfaces/models/data.response';
import { MovieCardConfig } from '../../interfaces/ui-config/movie-card-config.interfaces';

@Component({
  selector: 'app-home',
  standalone: true,
  providers: [GenericHttpService],
  imports: [InputComponent,MovieCardComponent, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  title: string ='All'
  movieCards: MovieCardConfig [] =[];
  constructor (private genericHttpService: GenericHttpService){}
  ngOnInit(): void {
    this.genericHttpService.httpGet(Endpoints.trends)
    .subscribe({
      next: (res: TrendData) =>{
        console.log(res.result)

        this.movieCards = res.result.map((item: TrendsResult)=> {
          return {
            img: Endpoints.image +`/w500/${item.backdrop_path}`,
            movieName: item.original_title,
            rate: item.vote_average
          } as MovieCardConfig
        })
      },
      error: (error:any) =>{
        console.error(error)
      }
    })
  }
}
