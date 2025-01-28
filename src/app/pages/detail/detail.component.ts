import { Component } from '@angular/core';
import { DetailBannerComponent } from "../../components/detail-banner/detail-banner.component";
import { ActivatedRoute } from '@angular/router';
import { GenericHttpService } from '../../services/generic-http.service';
import { HttpClientModule } from '@angular/common/http';
import { Endpoints } from '../../endpoints/Endpoints';
import { DetailBannerConfig } from '../../interfaces/ui-config/detail-banner-config.interfaces';
import { RateChipComponent } from "../../components/rate-chip/rate-chip.component";
import { DetailConfig } from '../../interfaces/ui-config/detail-config.interfaces';
import { Genre, Movie } from '../../interfaces/models/movie-detail.interface';

@Component({
  selector: 'app-detail',
  standalone:true,
  providers:[GenericHttpService],
  imports: [DetailBannerComponent, HttpClientModule, RateChipComponent],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {
  BannerConfig!: DetailBannerConfig;
  config!: DetailConfig;
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

  getMovieById(id: string) {
    this.genericService.tmdbGet(Endpoints.movieId(id)).subscribe({
      next: (res: Movie) => {
        console.log(res)
        this.genericService.tmdbGet(Endpoints.movieTranslate(id)).subscribe({
          next: (translationRes: any) => {
            console.log(translationRes)
            const spanishSpainTranslation = translationRes.translations.find(
              (t: any) => t.iso_639_1 === 'es' && t.iso_3166_1 === 'ES'
            );
            const spanishGlobalTranslation = translationRes.translations.find(
              (t: any) => t.iso_639_1 === 'es' && !t.iso_3166_1
            );
            const spanishMexicanTranslation = translationRes.translations.find(
              (t: any) => t.iso_639_1 === 'es' && t.iso_3166_1 === 'MX'
            );
  
            const translation = 
              spanishSpainTranslation || 
              spanishGlobalTranslation || 
              spanishMexicanTranslation;
  
            const translatedTitle = translation?.data.title || res.original_title;
            const translatedTagline = translation?.data.tagline || res.tagline;
            const translatedOverview = translation?.data.overview || res.overview;

            const backdropPath =
            res.backdrop_path || res.belongs_to_collection?.backdrop_path;          
            const posterPath =
            res.belongs_to_collection?.poster_path || res.poster_path;
            
            this.BannerConfig = {
              img: Endpoints.imagen + `/original/${backdropPath}`,
              tagline: translatedTagline,
              path: 'home',
              title: translatedTitle,
            }
            let result='';
            res.genres.map ((item: Genre, index: number) => {
              result += item.name + ' ' +(index === res.genres.length - 1  ? '' : ',')
            })
            this.config = {
              img: Endpoints.imagen + `/w500/${posterPath}`,
              subtitle: translatedTitle,
              description: translatedOverview,
              rate: res.vote_average,
              detailCards: [{
                title:'Tipo',
                description: 'Pelicula'
              },{
                title:'Año de Lanzamiento',
                description: res.release_date
              },{
                title:'Duración',
                description: res.runtime.toString()
              },{
                title:'Generos',
                description: result
              }
            ]
            }
          },
          error: (err: any) => {
            console.error('Error al obtener la traducción de la película:', err);
          }
        });
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }
  
  getSerieById(id: string) {
    this.genericService.tmdbGet(Endpoints.serieId(id)).subscribe({
      next: (res: any) => {
        this.genericService.tmdbGet(Endpoints.serieTranslate(id)).subscribe({
          next: (translationRes: any) => {
          const spanishSpainTranslation = translationRes.translations.find(
            (t: any) => t.iso_639_1 === 'es' && t.iso_3166_1 === 'ES'
          );
          const spanishGlobalTranslation = translationRes.translations.find(
            (t: any) => t.iso_639_1 === 'es' && !t.iso_3166_1
          );
          const spanishMexicanTranslation = translationRes.translations.find(
            (t: any) => t.iso_639_1 === 'es' && t.iso_3166_1 === 'MX'
          );

          const translation = 
            spanishSpainTranslation || 
            spanishGlobalTranslation || 
            spanishMexicanTranslation;

          const translatedTitle = translation?.data.name || res.name;
          const translatedTagline = translation?.data.tagline || res.tagline;
          const translatedOverview = translation?.data.overview || res.overview;

            this.BannerConfig = {
              img: Endpoints.imagen + `/original/${res.backdrop_path}`,
              tagline: translatedTagline,
              path: 'home',
              title: translatedTitle,
            };
          },
          error: (err: any) => {
            console.error('Error al obtener la traducción de la serie:', err);
          }
        });
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }
  


}
