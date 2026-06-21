import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage),
    canActivate: [authGuard]
  },
    {
    path: 'movies',
    loadComponent: () => import('./pages/movies/movies.page').then( m => m.MoviesPage)
  },
  {
    path: 'movies/:listId',
    loadComponent: () => import('./pages/movies/movies.page').then(m => m.MoviesPage),
  },
  {
    path: 'add-movie',
    loadComponent: () => import('./pages/add-movie/add-movie.page').then( m => m.AddMoviePage)
  },
  {
    path: 'edit-movie/:listId/:movieId',
    loadComponent: () => import('./pages/add-movie/add-movie.page').then(m => m.AddMoviePage),
  },
  {
    path: 'add-movie/:listId',
    loadComponent: () => import('./pages/add-movie/add-movie.page').then(m => m.AddMoviePage),
  },
];
