import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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
export class AuthModalComponent implements OnInit{
  @Input() showModal: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  errorMessage: string = '';
  isLoginMode: boolean = true;
  user = { username: '', email: '', password: '' }; // Incluir username
  isFormValid: boolean = false;
  errors: any = {};
  showPassword: boolean = false;

  constructor(private authService: AuthService) {}
  ngOnInit(): void { 
    this.errorMessage = '';
    this.isFormValid = false;
   }

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.user = { username: '', email: '', password: '' }; // Reinicia los campos
    this.errorMessage = '';
    this.errors = {};
  }

  close() {
    this.closeModal.emit();
  }

  onSubmit() {
    if (!this.validateForm()) return;
    if (this.isLoginMode) {
      this.authService.login(this.user).subscribe(
        (response: any) => {
          if (response && response.token) {
            console.log(response);
            localStorage.setItem('token', response.token); 
            let nombreEmail= this.user.email.split('@')[0]
            localStorage.setItem('username', nombreEmail);
            window.location.reload();
          } else {
            console.error('Token no recibido');
          }
        },
        (error) => {
          console.error('Error al iniciar sesión', error);
          this.errorMessage = 'Datos incorrectos';
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
          if (error.error === 'email') {
            document.getElementById("email")?.setAttribute("border-color","red")
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

  validateForm(): boolean {
    this.errors = {};
    let isValid = true;

    if (!this.isLoginMode && this.user.username.trim().length < 4) {
      document.getElementById("username")?.setAttribute("sytle"," background-color: red;");
      this.errors.username = 'El nombre debe tener al menos 4 caracteres';
      isValid = false;
    }
    if (!this.validateEmail(this.user.email)) {
      this.errors.email = 'Correo inválido';
      isValid = false;
    }
    if (!this.isLoginMode && !this.validatePassword(this.user.password)) {
      this.errors.password = 'La contraseña debe incluir mayúsculas, minúsculas, números y símbolos';
      isValid = false;
    }
    return isValid;
  }

  validateEmail(email: string): boolean {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }

  validatePassword(password: string): boolean {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  }
  logout() {
    // Eliminar el token y el nombre de usuario de localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.reload();
  }

}
