import { CommonModule } from '@angular/common'; 
import { Component, Input } from '@angular/core'; 
import { FormsModule } from '@angular/forms'; 
import { GenericHttpService } from '../../services/generic-http.service';
import { MarkdownModule } from 'ngx-markdown';
import configData from '../../../assets/data/info.json'; 

@Component({
  selector: 'app-info-page',
  standalone: true, 
  providers: [GenericHttpService], 
  imports: [FormsModule, CommonModule, MarkdownModule ],
  templateUrl: './info-page.component.html',
  styleUrl: './info-page.component.scss'
})
export class InfoPageComponent {
  config: any = configData; 
  constructor(private genericHttpService: GenericHttpService) {}  
  ngOnInit(): void {   
 }  
}
