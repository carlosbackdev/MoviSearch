import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-share-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './share-list.component.html',
  styleUrl: './share-list.component.scss',
    animations: [
      trigger('modalAnimation', [
        // Animación para la entrada
        transition(':enter', [
          style({ opacity: 0, transform: 'scale(0.8)' }),  
          animate('0.4s cubic-bezier(0.25, 0.8, 0.25, 1)', 
            style({ opacity: 1, transform: 'scale(1)' }))  
        ]),
        transition(':leave', [
          animate('0.3s cubic-bezier(0.25, 0.8, 0.25, 1)', 
            style({ opacity: 0, transform: 'scale(0.8)' }))  
        ])
      ])    
    ]
})
export class ShareListComponent {
  @Input() showModal: boolean = false;
  @Input() ListId!: number;
  @Output() showModalChange = new EventEmitter<boolean>();

  get shareUrl(): string {
    return `http://localhost:4200/share/list/${this.ListId}`;
  }

  closeModal() {
    this.showModal = false;
    this.showModalChange.emit(this.showModal);
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.shareUrl);
    alert('Enlace copiado al portapapeles');
  }

  shareViaWhatsApp() {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(this.shareUrl)}`, '_blank');
  }

  shareViaEmail() {
    window.open(`mailto:?subject=Compartir Lista&body=Mira esta lista: ${encodeURIComponent(this.shareUrl)}`);
  }
  shareViaTelegram() {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(this.shareUrl)}`, '_blank');
  }
}
