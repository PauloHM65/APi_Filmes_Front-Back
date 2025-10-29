import { Routes } from '@angular/router';
import { SearchComponent } from './pages/search/search.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DetailsComponent } from './pages/details/details.component';

export const routes: Routes = [
    { path: '', component: SearchComponent, title: 'Buscar Filmes' },
    { path: 'favorites', component: FavoritesComponent, title: 'Meus Favoritos' },
    { path: 'dashboard', component: DashboardComponent, title: 'Meu Dashboard' },
    { path: 'details/:id', component: DetailsComponent, title: 'Detalhes do Filme' },
    { path: '**', redirectTo: '', pathMatch: 'full' } // Wildcard route
];