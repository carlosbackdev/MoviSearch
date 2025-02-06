import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { GenericHttpService } from '../../services/generic-http.service';
import { Endpoints } from '../../endpoints/Endpoints';

@Component({
  selector: 'app-providers',
  imports: [],
  providers:[GenericHttpService],
  templateUrl: './providers.component.html',
  styleUrl: './providers.component.scss'
})
export class ProvidersComponent {
  @Input() config: any;

  constructor( private genericService: GenericHttpService, private cdr: ChangeDetectorRef) {}

  getMovieWatchProviders(movieId: string): void {
      this.genericService.tmdbGet(Endpoints.movieWatchProviders(movieId)).subscribe({
        next: (res: any) => {
          console.log('Proveedores de la película:', res);
          if (res.results?.ES || res.results?.US) {
            const providers = res.results.ES || res.results?.US;
            this.config.watchProviders = {
              flatrate: providers.flatrate || [],
              rent: providers.rent || [],
              buy: providers.buy || [],
            };
            this.cdr.detectChanges(); 
          }
        },
        error: (err: any) => {
          console.error('Error al obtener los proveedores de la película:', err);
        }
      });
    }
    
    getSerieWatchProviders(serieId: string): void {
      this.genericService.tmdbGet(Endpoints.serieWatchProviders(serieId)).subscribe({
        next: (res: any) => {
          console.log('Proveedores de la serie:', res);
          if (res.results?.ES || res.results?.US) {
            const providers = res.results.ES || res.results?.US;
            this.config.watchProviders = {
              flatrate: providers.flatrate || [],
              rent: providers.rent || [],
              buy: providers.buy || [],
            };
            this.cdr.detectChanges(); 
          }
        },
        error: (err: any) => {
          console.error('Error al obtener los proveedores de la serie:', err);
        }
      });
    }
    formatProviderName(name: string): string {
      return name.replace(/\s+/g, '').toLowerCase();
    }

}
