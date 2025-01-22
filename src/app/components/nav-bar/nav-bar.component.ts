import { Component, input } from '@angular/core';
import {NavItemConfig} from '../../interfaces/ui-config/navi-item-config.interfaces';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  navItems: NavItemConfig[] = [{
    name: 'Peliculas',
    path: 'movie',
    icon:'bi bi-film',
    active: true
  },
  {
    name: 'Listas',
    path: 'list',
    icon:'bi bi-bar-chart-fill',
    active: false
  }
  ,
  {
    name: 'Contacto',
    path: 'contac',
    icon:'bi bi-send-fill',
    active: false
  }]

  constructor(private router: Router){}
  selectedItem(nav: NavItemConfig){
    this.navItems.map((item: NavItemConfig) => {
      item.active = nav.name === item.name;
    })
  }
  homePage(){
    this.router.navigateByUrl('')
  }
}
