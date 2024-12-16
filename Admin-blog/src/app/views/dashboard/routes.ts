import { Routes } from '@angular/router';
import { AuthGuard } from '../../Shared/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent),
    data: {
      title: 'Trang chủ',
      requiredPolicy: 'Permissions.Dashboard.View',
    },
    canActivate: [AuthGuard],
  },

];

