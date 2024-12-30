import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'series/',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () =>
      import('./series.component').then((m) => m.SeriesComponent),
    data: {
      title: 'ALL Post',
    },
  }
  
  
];
