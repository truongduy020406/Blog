import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'post/',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () =>
      import('./posts/posts.component').then((m) => m.PostsComponent),
    data: {
      title: 'ALL Post',
    },
  },
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./post-detail/post-detail.component').then((m) => m.PostDetailComponent),
    data: {
      title: 'deail Post',
    },
  },{
    path: 'newpost',
    loadComponent: () =>
      import('./new-post/new-post.component').then((m) => m.NewPostComponent),
    data: {
      title: 'new Post',
    },
  },
  
];
