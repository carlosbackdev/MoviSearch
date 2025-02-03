import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss',
})
export class AuthModalComponent {
  @Input() showModal: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  errorMessage: string = '';
  isLoginMode: boolean = true;
  user = { username: '', email: '', password: '' }; // Incluir username

  constructor(private authService: AuthService) {}

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.user = { username: '', email: '', password: '' }; // Reinicia los campos
  }

  close() {
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.isLoginMode) {
      this.authService.login(this.user).subscribe(
        (response: any) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);  // Guardar el token
            this.close();  // Cerrar el modal
          } else {
            console.error('Token no recibido');
          }
        },
        (error) => {
          console.error('Error al iniciar sesión', error);
        }
      );
    } else {
      this.authService.register(this.user).subscribe(
        (response) => {
          if (response) {
            alert('Registro exitoso. Inicia sesión ahora.');
            this.switchMode();  // Cambiar a modo de login
          }
        },
        (error) => {
          console.error('Error al registrarse', error);
          // Asumimos que el error contiene un mensaje indicando "email" o "username"
          if (error.error === 'email') {
            this.errorMessage = 'El correo electrónico ya está registrado.';
          } else if (error.error === 'username') {
            this.errorMessage = 'El nombre de usuario ya está registrado.';
          } else {
            this.errorMessage = 'Error desconocido. Por favor, inténtalo de nuevo.';
          }
        }        
      );
    }
  }
}
