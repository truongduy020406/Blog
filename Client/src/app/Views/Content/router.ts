import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'post/',
    pathMatch: 'full',
  },
  {
    path: 'post',
    loadComponent: () =>
      import('./posts/posts.component').then((m) => m.PostsComponent),
    data: {
      title: 'ALL Post',
    },
  },
  {
    path: 'postdetail/:id',
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
  },{
    path: 'allQuestion',
    loadComponent: () =>
      import('./all-question/all-question.component').then((m) => m.AllQuestionComponent),
    data: {
      title: 'all Question',
    },
  },
  {
    path: 'QuestionC',
    loadComponent: () =>
      import('./all-question/all-question.component').then((m) => m.AllQuestionComponent),
    data: {
      title: 'all Question',
    },
  },
  {
    path: 'QuestionC/:id',
    loadComponent: () =>
      import('./question-client-detail/question-client-detail.component').then((m) => m.QuestionClientDetailComponent),
    data: {
      title: 'Question Client',
    },
  },
  
];
