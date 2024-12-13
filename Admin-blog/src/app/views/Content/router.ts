import { Routes } from '@angular/router';
import { PostsComponent } from './posts/posts.component'
import { AuthGuard } from 'src/app/shared/auth.guard';
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
      title: 'Bài viết',
      requiredPolicy: 'Permissions.Posts.View',
    },
    canActivate: [AuthGuard],
  }
];
