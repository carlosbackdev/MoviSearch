import { Component, Input,   Output, EventEmitter, OnChanges, SimpleChanges  } from '@angular/core';
import { GenericHttpService } from '../../services/generic-http.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ListService } from '../../services/list.service';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-add-list',
  standalone: true,
  providers: [GenericHttpService],
  imports: [FormsModule, CommonModule],
  templateUrl: './add-list.component.html',
  styleUrl: './add-list.component.scss',
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
export class AddListComponent {
  @Input() showModal: boolean = false;  
  @Input() movieId!: number; // ID de la película a agregar
  @Output() showModalChange = new EventEmitter<boolean>(); 

  successClass = 'success-message' ;
  userLists: any[] = [];
  newListName: string = '';
  itemId:number =0;
  showSuccessMessage: boolean = false; // Controla si se muestra el mensaje de éxito
  successMessage: string = ''; 
  selectedList: string | null = null;

  constructor(private genericHttpService: GenericHttpService, private authService: AuthService, private listService: ListService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showModal'] && this.showModal) {
      this.openModal(this.movieId); 
    }
  }
  
  openModal(movieId: number) {
    this.movieId = movieId;
    this.showModal = true;
    this.itemId=this.movieId;
    console.log("Película añadida:", this.itemId);
    this.getUserLists();
  }

  closeModal() {
    this.showModal = false;
    this.showModalChange.emit(false);
    this.showSuccessMessage = false;
  }

  getUserLists(): void {
    this.listService.getUserLists().subscribe(
      (lists) => {
        this.userLists = lists;
      },
      (error) => {
        console.error('Error al obtener listas:', error);
        localStorage.clear();
        window.location.reload();
      }
    );
  }

    createList(): void {
      for(let i=0;i<this.userLists.length;i++){
        if(this.newListName.trim().toLowerCase() === this.userLists[i].name){ 
          return;
        }
      }
      console.log('Enviando lista:', this.newListName);  
      if (!this.newListName.trim().toLowerCase()) {
          console.warn('El nombre de la lista no puede estar vacío.');
          return;
      }

      this.listService.createList(this.newListName.trim().toLowerCase()).subscribe(
          (response) => {
              console.log('Lista creada:', response);
              this.getUserLists(); 
              this.newListName = ''; 
              this.successMessage = ''; 
              this.successClass = 'none' ;
          },
          (error) => {
              console.error('Error al crear la lista:', error);
              console.error('Error details:', error.error);
          }
      );
  }


  addToExistingList(listName: string): void {
    console.log(listName);
    this.listService.addMovieToList(listName, this.itemId).subscribe(
      () => {
        console.log(`Película ${this.itemId} añadida a la lista ${listName}`);
        this.successClass = 'success-message' ;
        this.showSuccessMessage = true;
        this.successMessage = `Película añadida a la lista "${listName}"`;
      },
      (error) => {
        console.error('Error al añadir la película a la lista:', error);
        if(error.error?.message === 'La película ya está en la lista.'){
          this.showSuccessMessage = true;
          this.successMessage = `el elemento ya existe en: "${listName}"`;
          this.successClass='success-red'; 
          localStorage.clear();
          window.location.reload();
        }
      }
    );
  }
  deleteList(listName: string): void {
    console.log(listName);
    this.listService.deleteListUser(listName).subscribe(
      () => {
        console.log(`Lista ${listName} eliminada`);
        this.showSuccessMessage = true;
        this.successMessage = `la Lista: "${listName}" ha sido eliminada`;
        this.getUserLists();
        this.successClass='success-red';        
      },
      (error) => {
        console.error('Error al eleminar la lista:', error);
      }
    );
  }
}
