import { Component } from '@angular/core';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { SegmentedControlComponent } from "../../components/segmented-control/segmented-control.component";
import{ SegmentedControlConfig } from "../../interfaces/ui-config/segmented-control-component.interfaces";
import { InputComponent } from "../../components/input/input.component";
import { RateChipComponent} from "../../components/rate-chip/rate-chip.component";
import { MovieCardComponent } from "../../components/movie-card/movie-card.component";
import { MovieCardConfig } from '../../interfaces/ui-config/movie-card-config.interfaces';

@Component({
  selector: 'app-test',
  imports: [NavBarComponent, SegmentedControlComponent, InputComponent, RateChipComponent, MovieCardComponent],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {
  segments: SegmentedControlConfig[] = [
    {
    name:'Todas',
    active: true
    },
    {
      name:'Nuevas',
      active: false
    },
    {
      name:'Mismo Genero',
      active: false
    }]
    movieCard: MovieCardConfig []= [{
    img:'https://image.tmdb.org/t/p/original/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg',
    rate:7.28,
    movieName:'PELI1' 
  },{
    img:'https://image.tmdb.org/t/p/original/wigZBAmNrIhxp2FNGOROUAeHvdh.jpg',
    rate:6.28,
    movieName:'PELI2' 
  },{
    img:'https://image.tmdb.org/t/p/original/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg',
    rate:6.28,
    movieName:'PELI3' 
  },{
    img:'https://image.tmdb.org/t/p/original/wigZBAmNrIhxp2FNGOROUAeHvdh.jpg',
    rate:6.28,
    movieName:'PELI4' 
  }]
}
