import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { GenericHttpService } from '../../services/generic-http.service';
import { CommonModule } from '@angular/common';
import { Endpoints } from '../../endpoints/Endpoints';
import { MovieCastResponse } from '../../interfaces/models/CastMovie.interface';

@Component({
  selector: 'app-person',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss'],
})
export class PersonComponent {
  @Input() showModal: boolean = false;
  @Input() movieId!: number;
  @Input() tvId!: number;
  @Output() showModalChange = new EventEmitter<boolean>();
  cast: any[] = [];
  crew: any[] = [];

  constructor(private genericHttpService: GenericHttpService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showModal'] && this.showModal) {
      this.openModal(this.movieId, this.tvId);
    }
  }

  openModal(movieId: number, tvId: number) {
    this.movieId = movieId;
    this.showModal = true;
    this.tvId = tvId;
    if (this.movieId > 0) {
      this.getCastMovie(this.movieId);
    } else {
      this.getCastTv(this.tvId);
    }
  }

  closeModalPerson() {
    this.showModal = false;
    this.showModalChange.emit(false);
  }

  getCastMovie(movieId: number) {
    this.genericHttpService.tmdbGet(Endpoints.movieCast(movieId)).subscribe({
      next: (response: MovieCastResponse) => {
        this.cast = response.cast.slice(0, 20).map((item) => ({
          known_for_department: item.known_for_department,
          name: item.name,
          profile_path: item.profile_path,
          character: item.character,
        }));

        const crewRoles = ['Director', 'Writer', 'Executive Producer'];
        this.crew = response.crew
          .filter((item) => crewRoles.includes(item.job))
          .map((item) => ({
            name: item.name,
            job: item.job,
            profile_path: item.profile_path,
          }));
      },
      error: (error: any) => {
        console.error('Error al obtener el cast:', error);
      },
    });
  }

  getCastTv(tvId: number) {
    console.log('Serie:', this.tvId);
    this.genericHttpService.tmdbGet(Endpoints.serieCast(tvId)).subscribe({
      next: (response: MovieCastResponse) => {
        this.cast = response.cast.slice(0, 20).map((item) => ({
          known_for_department: item.known_for_department,
          name: item.name,
          profile_path: item.profile_path,
          character: item.character,
        }));

        const crewRoles = ['Director', 'Writer', 'Executive Producer'];
        this.crew = response.crew
          .filter((item) => crewRoles.includes(item.job))
          .map((item) => ({
            name: item.name,
            job: item.job,
            profile_path: item.profile_path,
          }));
      },
      error: (error: any) => {
        console.error('Error al obtener el cast:', error);
      },
    });
  }

  getProfileImageUrl(path: string): string {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
}