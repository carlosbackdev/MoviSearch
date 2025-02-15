import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-confirm',
  standalone: true,
  providers: [AuthService],
  imports: [],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss'
})
export class ConfirmComponent implements OnInit{
  id: number | null = null;

  constructor (private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router){}

  ngOnInit(): void {
    const idFromUrl = this.route.snapshot.paramMap.get('id');
    if (idFromUrl !== null) {
      this.id = +idFromUrl; // El operador "+" convierte el string a número
    }
    this.auth();
  }

  auth(){
    if(this.id !== null){
      this.authService.confirm(this.id).subscribe(
        (response: any) => {
            console.log(response);
            this.router.navigate(['/home']);
            
        },
        (error) => {
          console.error('Error al iniciar sesión', error);
          this.router.navigate(['/home']);
        }
      );
    }else{
      console.log("sin id")
    }
  }


}
