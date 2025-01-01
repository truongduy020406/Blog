import { Routes } from '@angular/router';

export const routes: Routes = [
  
  {
    path: '',
    loadComponent: () =>
      import('./Layout/home/home.component').then((m) => m.HomeComponent),
    data: {
      title: 'Home',
    },
  },
  {
    path: 'Auth',
    loadChildren: () => import('./Views/Auth/router').then((m) => m.routes)
  },
  {
    path: 'content',
    loadChildren: () => import('./Views/Content/router').then((m) => m.routes)
  },
  {
    path: 'series',
    loadChildren: () => import('./Views/series/router').then((m) => m.routes)
  },
  {
    path: 'user',
    loadChildren: () => import('./Views/User/router').then((m) => m.routes)
  }
];