import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'Auth',
    loadChildren: () => import('./Views/Auth/router').then((m) => m.routes)
  },
  {
    path: 'post',
    loadChildren: () => import('./Views/Content/router').then((m) => m.routes)
  },
];