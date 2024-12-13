import { Routes } from '@angular/router';
import { PostsComponent } from 'src/app/views/Content/posts/posts.component'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'posts',
    pathMatch: 'full',

  },
  {
    path: 'posts',
    component: PostsComponent,
    data: {
      title: $localize`posts`
    }
  }
];
