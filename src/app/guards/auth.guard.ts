import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Importa tu AuthService

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); 
  const router = inject(Router); 

  if (authService.isAuthenticated()) {
    return true; 
  } else {
    router.navigate(['/home'], { state: { redirected: true } });
    return false; // Bloquea el acceso
  }
};