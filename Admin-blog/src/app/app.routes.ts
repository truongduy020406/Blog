import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';

export const routes: Routes = [
  {
    path: 'Auth',
    loadChildren: () => import('./views/Auth/routes').then((m) => m.routes)
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'system',
        loadChildren: () => import('./views/System/router').then((m) => m.routes)
      },
      {
        path: 'content',
        loadChildren: () => import('./views/Content/router').then((m) => m.routes)
      },
      {
        path: 'royalty',
        loadChildren: () => import('../app/views/Royalty/router').then((m) => m.routes),
      },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
