import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TestComponent } from './pages/test/test.component';
import { DetailComponent } from './pages/detail/detail.component';
import { ListComponent } from './pages/list/list.component';
import { ContactComponent } from './pages/contact/contact.component';

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
        path: 'list', 
        component: ListComponent
    }, 
    {
        path: 'contact', 
        component: ContactComponent
    },
    {
        path: 'test', 
        component: TestComponent
    },{
        path: 'movie/:movie_id',
        component: DetailComponent
    },{
        path: 'serie/:serie_id',
        component: DetailComponent
    }

];
