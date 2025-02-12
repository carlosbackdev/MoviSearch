import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-input',
  imports: [FormsModule, CommonModule, MarkdownModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
  @Input() chat: string = '';
  @Output() searchEvent = new EventEmitter<string>();
  @Output() searchSubmit = new EventEmitter<string>();
  chatLines: string[] = [];
  chatdata: string='';


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chat']) {
      this.showChatDialog(); // Llamamos al método cuando chat cambia
    }
  }

  showChatDialog(): void {
    let i = 0;
    this.chatLines = []; // Limpiar las líneas previas
    const chatLength = this.chat.length;

    const interval = setInterval(() => {
      // Agregar una letra por vez
      this.chatLines.push(this.chat[i]);
      i++;

      if (i >= chatLength) {
        clearInterval(interval); // Detener el intervalo cuando se haya mostrado todo el texto
      }
    }, 10); // Mostrar una letra cada 50ms (ajustable)
  }

  onInputChange(event: any): void {
    this.searchEvent.emit(event.target.value);
  }

  onKeyPress(event: any): void {
    if (event.key === 'Enter') {
      this.searchSubmit.emit(event.target.value); 
    }
  }

  onButtonClick(event: any, inputElement: HTMLInputElement): void {
    this.searchSubmit.emit(inputElement.value); 
  }
}
