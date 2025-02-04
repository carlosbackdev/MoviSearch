import { Component, Input } from '@angular/core';
import { GenericHttpService } from '../../services/generic-http.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-list',
  standalone: true,
  providers: [GenericHttpService],
  imports: [FormsModule,CommonModule],
  templateUrl: './add-list.component.html',
  styleUrl: './add-list.component.scss'
})
export class AddListComponent {
  
  @Input() movieId!: number; // ID de la película a agregar
  showModal: boolean = false;
  userLists: any[] = [];
  newListName: string = '';

  constructor(private genericHttpService: GenericHttpService, private authService: AuthService) {}

  openModal(movieId: number) {
    this.movieId = movieId;
    this.showModal = true;
    this.getUserLists();
  }

  closeModal() {
    this.showModal = false;
  }

  getUserLists() {
    this.genericHttpService.get('/api/user/lists').subscribe((lists: any) => {
      this.userLists = lists;
    });
  }

  createList() {
    if (this.newListName.trim()) {
      this.genericHttpService.post('/api/user/lists', { name: this.newListName }).subscribe(() => {
        this.getUserLists(); 
        this.newListName = ''; 
      });
    }
  }

  addToExistingList(listName: string) {
    this.genericHttpService.post('/api/user/lists/add-movie', {
      listName,
      movieId: this.movieId,
    }).subscribe(() => {
      this.closeModal();
    });
  }
}
