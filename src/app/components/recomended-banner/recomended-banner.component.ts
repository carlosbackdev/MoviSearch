import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recomended-banner',
  imports: [],
  templateUrl: './recomended-banner.component.html',
  styleUrl: './recomended-banner.component.scss'
})
export class RecomendedBannerComponent {
@Input() config!: any;

constructor (){}

}
