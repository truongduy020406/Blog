import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { PostService } from '../../Views/Content/Services/post.service';
import { CommonModule, DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import { forkJoin, map } from 'rxjs';
import { PostInListDto } from '../../Views/Content/Model/PostInListDto.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DataViewModule,
    TagModule,
    ButtonModule,
    CommonModule,
    DatePipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit {
  dataPost: PostInListDto[] = [];
  private postService = inject(PostService);
   private router = inject(Router)
  ngOnInit(): void {
    this.postService.getPostsPaging('', '', 1, 10).subscribe((res) => {
      this.dataPost = res.results.filter(data => data.status === 3);
      
      const postsWithTags$ = this.dataPost.map(post => {
        return this.postService.getPostTags(post.id).pipe(
          map(tags => ({
            ...post,
            tags, // Gắn thêm trường tags
            thumbnail: environment.API_URL + post.thumbnail
          }))
        );
      });
  
      forkJoin(postsWithTags$).subscribe(postsWithTags => {
        this.dataPost = postsWithTags;
        this.dataPost.map(data => {
          console.log(data.tags)
        })
      });

      
    });
    
  }

  getProductTag(tag:string){
    this.postService.getPostsByTag(tag,1).subscribe(res => {
      this.dataPost = res.posts
      this.dataPost.map(data => {
        data.thumbnail = environment.API_URL + data.thumbnail
      })
      console.log(this.dataPost)
    })
  }
  navigateToDetail(id:string|undefined){
    this.router.navigate([`post/detail/${id}`])
  }
}
