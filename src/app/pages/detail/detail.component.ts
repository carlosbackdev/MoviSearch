import { Component } from '@angular/core';
import { DetailBannerComponent } from "../../components/detail-banner/detail-banner.component";
import { ActivatedRoute } from '@angular/router';
import { GenericHttpService } from '../../services/generic-http.service';
import { HttpClientModule } from '@angular/common/http';
import { Endpoints } from '../../endpoints/Endpoints';

@Component({
  selector: 'app-detail',
  standalone:true,
  providers:[GenericHttpService],
  imports: [DetailBannerComponent, HttpClientModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {
  constructor( private genericService: GenericHttpService,
    private activatedRoute: ActivatedRoute) {}
  ngOnInit(): void{

    this.activatedRoute.paramMap.subscribe((paramMap: any) => {
      console.log("Params: ", paramMap);
      const movieId = paramMap.get('movie_id');
      const serieId = paramMap.get('serie_id');

      if (movieId){
        this.getMovieById(movieId);
      }else if(serieId){
        this.getSerieById(serieId);
      }

    }) 
  }

  getMovieById(id: string){
    this.genericService.tmdbGet(Endpoints.movieId(id)).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }

  getSerieById(id: string){
    this.genericService.tmdbGet(Endpoints.serieId(id)).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }


}
