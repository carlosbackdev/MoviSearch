import { Component, Input, Output, EventEmitter } from '@angular/core';
import {MovieCardConfig } from '../../interfaces/ui-config/movie-card-config.interfaces'
import { RateChipComponent } from "../rate-chip/rate-chip.component";
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-movie-card',
  imports: [RateChipComponent],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
   animations: [
    trigger('fadeInScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('0.8s ease-in', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
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
