import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import contactData from '../../../assets/data/contact.json';

@Component({
  selector: 'app-contact-social',
  standalone: true, 
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
  enviarFormulario() {
    console.log(this.formData);
    
    this.formData={
      nombre: '',
      email: '',
      mensaje: ''
    };
  }

  constructor() {}

}