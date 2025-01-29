import { Component, Input } from '@angular/core';
import {MovieCardConfig } from '../../interfaces/ui-config/movie-card-config.interfaces'
import { RateChipComponent } from "../rate-chip/rate-chip.component";

@Component({
  selector: 'app-movie-card',
  imports: [RateChipComponent],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {
  @Input() config!: any

  onAddClick(event: Event) {
    event.stopPropagation(); 
    if (this.config.onAddClick) {
      this.config.onAddClick();
    }
  }
}
