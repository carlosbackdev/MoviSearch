import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import contactData from '../../../assets/data/contact.json';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-contact-social',
  standalone: true, 
    providers: [AuthService],
  imports: [FormsModule, CommonModule ],
  templateUrl: './contact-social.component.html',
  styleUrl: './contact-social.component.scss'
})
export class ContactSocialComponent {
  formData = {
    nombre: '',
    email: '',
    mensaje: ''
  };
  contactInfo = contactData; 

  constructor(private authService: AuthService) {}

  enviarFormulario() {
    console.log(this.formData);
    this.authService.form(this.formData.nombre,this.formData.email,this.formData.mensaje).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error: any) => {
        console.error('Error', error);
      }
    );

    this.formData={
      nombre: '',
      email: '',
      mensaje: ''
    };
  }

}