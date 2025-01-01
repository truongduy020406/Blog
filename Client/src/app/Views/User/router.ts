import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'user',
    pathMatch: 'full',
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then((m) => m.ProfileComponent),
    data: {
      title: 'user profile',
    },
  },
  {
    path: 'question',
    loadComponent: () =>
      import('./question/question.component').then((m) => m.QuestionComponent),
    data: {
      title: 'question',
    },
  }
  
];
