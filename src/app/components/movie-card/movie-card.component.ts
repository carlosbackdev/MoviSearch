import { Component, Input } from '@angular/core';
import {MovieCardConfig } from '../../interfaces/ui-config/movie-card-config.interfaces'

@Component({
  selector: 'app-movie-card',
  imports: [],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {
  @Input() config!: MovieCardConfig

}
