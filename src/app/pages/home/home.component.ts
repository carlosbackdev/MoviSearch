import { Component, OnInit } from '@angular/core';
import { InputComponent } from '../../components/input/input.component';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { GenericHttpService } from '../../services/generic-http.service';

@Component({
  selector: 'app-home',
  imports: [InputComponent,MovieCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  title: string ='All'
  constructor (private genericHttpService: GenericHttpService){}
  ngOnInit(): void {
    
  }
}
