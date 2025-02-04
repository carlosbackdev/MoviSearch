import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() addToList = new EventEmitter<number>(); // Evento para emitir el ID de la película

  onAddClick(event: Event) {
    event.stopPropagation();  
    this.addToList.emit(this.config.id); // Emitir el ID de la película al componente padre
  }
}
