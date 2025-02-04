import { Component, input } from '@angular/core';
import {NavItemConfig} from '../../interfaces/ui-config/navi-item-config.interfaces';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';

@Component({
  selector: 'app-nav-bar',
  standalone:true,
  imports: [CommonModule, AuthModalComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  showLoginModal: boolean = false;
  username: string | null = null;
  navItems: NavItemConfig[] = [{
    name: 'Descubrir',
    path: 'home',
    icon:'bi bi-film',
    active: true
  },
  {
    name: 'Listas',
    path: 'list',
    icon:'bi bi-bar-chart-fill',
    active: false
  },
  {
    name: 'Conectarse', 
    path: 'profile', 
    icon: 'bi bi-person-fill',
    active: false,
  },
  {
    name: 'Contacto',
    path: 'contact',
    icon:'bi bi-send-fill',
    active: false
  },]

  constructor(private router: Router, private authService: AuthService){}
  selectedItem(nav: NavItemConfig){
    if (nav.path === 'list' && !this.authService.isAuthenticated()) {
        this.showLoginModal = true;
        return; 
    }

    if (nav.name === 'Conectarse' && !this.authService.isAuthenticated()) {
        this.showLoginModal = true; 
        return; 
    }
    
    if (nav.path === 'profile' && this.authService.isAuthenticated()) {
         this.router.navigateByUrl(nav.path); 
         return;
    }

    this.navItems.forEach((item: NavItemConfig) => {
      item.active = nav.name === item.name;
    });
    this.router.navigateByUrl(nav.path);
  }
  
  homePage(){
    this.router.navigateByUrl('')
  }
   // Método para obtener el nombre de usuario
   getUsername() {
  }

  // Método para actualizar el ítem de navegación
  updateNavItem() {
    const connectItem = this.navItems.find((item) => item.name === 'Conectarse');
    if (connectItem) {
      connectItem.name = this.username || 'Conectarse'; // Cambia el nombre al nombre de usuario
    }
  }

  // Método para cerrar el modal
  onCloseModal() {
    this.showLoginModal = false;
  }
}
