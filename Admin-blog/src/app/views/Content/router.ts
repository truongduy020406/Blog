import { Routes } from '@angular/router';
import { PostsComponent } from './posts/posts.component'
import { AuthGuard } from '../../Shared/auth.guard';
import { PostCategoryComponent } from './post-category/post-category.component';
import { SeriesComponent } from './series/series.component'
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
  },
  {
    path: 'post-categories',
    component: PostCategoryComponent,
    data: {
      title: 'Danh mục',
      requiredPolicy: 'Permissions.PostCategories.View',
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'series',
    component: SeriesComponent,
    canActivate: [AuthGuard],
    data: {
      requiredPolicy: 'Permissions.Series.View',
    },
  },
];
