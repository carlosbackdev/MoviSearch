import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TestComponent } from './pages/test/test.component';
import { DetailComponent } from './pages/detail/detail.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    }, 
    {
        path: 'home', 
        component: HomeComponent
    },
    {
        path: 'test', 
        component: TestComponent
    },{
        path: 'movie/:series_id',
        component: DetailComponent
    },{
        path: 'serie/:movie_id',
        component: DetailComponent
    }

];
