import { Component, HostListener, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NavItemConfig} from '../../interfaces/ui-config/navi-item-config.interfaces';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';

@Component({
  selector: 'app-nav-bar',
  standalone:true,
  imports: [CommonModule, AuthModalComponent, FormsModule, CommonModule,],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  showLoginModal: boolean = false;
  menuOpen: boolean = false;
  username: string | null = null;
  navItems: NavItemConfig[] = [{
    name: 'Descubrir',
    path: 'home',
    icon:'bi bi-film',
    active: true
  },
  {
    name: 'Nuestras Selecciones',
    path: 'discover',
    icon:'bi bi-bar-chart-fill',
    active: false
  },
  {
    name: 'Tus Listas',
    path: 'list',
    icon:'bi bi-bookmark-plus-fill',
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
  ngOnInit() {
    this.username = localStorage.getItem('username');
    this.updateNavItem();
  }
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

    }

    this.navItems.forEach((item: NavItemConfig) => {
      item.active = nav.name === item.name;
    });
    this.router.navigateByUrl(nav.path);
  }
  
 homePage() {
  this.setActiveNavItem('home');
  this.router.navigateByUrl('');
  }

  setActiveNavItem(path: string) {
    this.navItems.forEach(item => item.active = (item.path === path));
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
  logout() {
    this.authService.logout();
    this.router.navigateByUrl('home');
    window.location.reload();
  }

  deleteAccount() {
//falta la logica
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }
  
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    }
    peliculas() {
      this.router.navigate(['/discover', 'peliculas']);
    }
    
    series() {
      this.router.navigate(['/discover', 'series']);
    }

    @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const menu = document.querySelector('.nav-bar-container ul');
    const menuIcon = document.querySelector('.menu-icon');

    if (menu && menuIcon) {
      const isClickInsideMenu = menu.contains(target);
      const isClickOnMenuIcon = menuIcon.contains(target);

      if (!isClickInsideMenu && !isClickOnMenuIcon) {
        this.menuOpen = false;
      }
    }
  }
    
  
  
}
