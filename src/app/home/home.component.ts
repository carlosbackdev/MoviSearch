import { Component } from '@angular/core';
import { InputComponent } from '../components/input/input.component';

@Component({
  selector: 'app-home',
  imports: [InputComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  title: string ='All'
}
