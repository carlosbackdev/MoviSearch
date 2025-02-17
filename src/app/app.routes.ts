import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TestComponent } from './pages/test/test.component';
import { DetailComponent } from './pages/detail/detail.component';
import { ListComponent } from './pages/list/list.component';
import { ContactComponent } from './pages/contact/contact.component';
import { authGuard } from './guards/auth.guard';
import { ConfirmComponent } from './pages/confirm/confirm.component';
import { DiscoverComponent } from './pages/discover/discover.component';
import { ViewListComponent } from './pages/view-list/view-list.component';



export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    }, 
    {
        path: 'home', 
        component: HomeComponent,
    },
    {
        path: 'discover/:category', 
        component: DiscoverComponent,
    },
    {
        path: 'list', 
        component: ListComponent,
        canActivate: [authGuard],
    },
    {
        path: 'share/list/:id', 
        component: ViewListComponent,
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
    },{
        path: 'auth/:id',
        component: ConfirmComponent
    }

];

