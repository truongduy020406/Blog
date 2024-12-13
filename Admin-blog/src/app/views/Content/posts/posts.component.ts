import { Component, inject } from '@angular/core';
import { AuthService } from '../../Auth/Service/auth.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent {
  private authApiClient = inject(AuthService)
  

  test() {
    this.authApiClient.test().subscribe({
      next: () => {
        console.log('ok');
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
}
