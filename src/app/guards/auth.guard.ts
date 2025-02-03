import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Importa tu AuthService

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Obtiene una instancia de AuthService
  const router = inject(Router); // Obtiene una instancia de Router

  if (authService.isAuthenticated()) {
    return true; // Permite el acceso si el usuario está autenticado
  } else {
    router.navigate(['/home']); // Redirige al home si no está autenticado
    return false; // Bloquea el acceso
  }
};