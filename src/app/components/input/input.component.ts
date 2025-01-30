import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
  @Output() searchEvent = new EventEmitter<string>();
  @Output() searchSubmit = new EventEmitter<string>();

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
