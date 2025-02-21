import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { GenericHttpService } from '../../services/generic-http.service';
import { ChatStateService } from '../../services/chat-state.service';


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

  constructor(private genericHttpService: GenericHttpService,
    private chatStateService: ChatStateService
  ) {}
  
  ngOnInit() {
    // Verificamos si ya hay texto guardado en el servicio
    if (this.chatStateService.chatText) {
      this.chat = this.chatStateService.chatText;
      this.chatLines = [this.chat];  
    } else {
      // Si no hay texto guardado, hacemos la llamada al servicio
      this.genericHttpService.getChatData().subscribe((data) => {
        this.chatdata = data.chatText;
        this.chat = this.chatdata;
        this.chatStateService.chatText = this.chat;  
        this.showChatDialog();  
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chat']) {
      this.showChatDialog(); 
    }
  }
  ngOnDestroy() {
    if (this.chatLines.length > 0) {
      this.chatStateService.chatText = this.chatLines.join('');
    }
  }

  showChatDialog(): void {
    let i = 0;
    this.chatLines = []; 
    const chatLength = this.chat.length;

    const interval = setInterval(() => {
      // Agregar una letra por vez
      this.chatLines.push(this.chat[i]);
      i++;

      if (i >= chatLength) {
        clearInterval(interval); 
      }
    }, 10); 
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
