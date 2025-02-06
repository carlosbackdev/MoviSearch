import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GenericHttpService } from '../../services/generic-http.service';
import { AuthService } from '../../services/auth.service';
import { ListService } from '../../services/list.service';
import { List, Movie } from '../../interfaces/ui-config/list-user-config.interfaces';

@Component({
  selector: 'app-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {

userLists: any [] =  [];
movieIds: number [] =  [];

constructor(private genericHttpService: GenericHttpService, private authService: AuthService, private listService: ListService) {}

ngOnInit(): void { 
  this.getUserLists();
}

getUserLists(): void {
    this.listService.getMovieLists().subscribe(
      (lists: List[]) => {
        this.userLists = lists;
        this.movieIds = lists.flatMap(list => list.movies.map(movie => movie.movieId));
        console.log(lists);
        console.log(this.movieIds);
      },
      (error) => {
        console.error('Error al obtener listas:', error);
      }
    );
  }
deleteList(listName: string): void {
    console.log(listName);
    this.listService.deleteListUser(listName).subscribe(
      () => {
        this.getUserLists();
        console.log(`Lista ${listName} eliminada`);
      },
      (error) => {
        console.error('Error al eleminar la lista:', error);
      }
    );
  }


}
