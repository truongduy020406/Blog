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
import { QuestionService } from '../../Views/User/Services/question.service';
import { questionDTO } from '../../Views/User/Models/question.model';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DataViewModule, TagModule, ButtonModule, CommonModule, DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit {
  dataPost: PostInListDto[] = [];
  dataPostPopular: PostInListDto[] = [];

  pageIndex: number = 1;
  pageSize: number = 10;
  totalCount?: number;
  dataQuestion: questionDTO[] = [];
  private postService = inject(PostService);
  private router = inject(Router);
  private questionService = inject(QuestionService);

  ngOnInit(): void {
    this.loadQuestion();
    this.loadData();
    this.getPostPopular();
  }

  loadQuestion() {
    this.questionService.getLastQuestion().subscribe((res) => {
      this.dataQuestion = res;
      console.log('1', this.dataQuestion);
    });
  }
  loadData() {
    this.postService.getPostsPaging('', '', 1, 10).subscribe((res) => {
      this.dataPost = res.results.filter((data) => data.status === 3);
      this.totalCount = this.dataPost.length;
      const postsWithTags$ = this.dataPost.map((post) => {
        return this.postService.getPostTags(post.id).pipe(
          map((tags) => ({
            ...post,
            tags, // Gắn thêm trường tags
            thumbnail: environment.API_URL + post.thumbnail,
          }))
        );
      });

      forkJoin(postsWithTags$).subscribe((postsWithTags) => {
        this.dataPost = postsWithTags;
      });
    });
  }

  getPostPopular() {
    this.postService.getPopularProfiles(5).subscribe((res) => {
      this.dataPostPopular = res.filter((data) => data.status === 3);
      this.totalCount = this.dataPost.length;
      const postsWithTags$ = this.dataPost.map((post) => {
        return this.postService.getPostTags(post.id).pipe(
          map((tags) => ({
            ...post,
            tags, // Gắn thêm trường tags
            thumbnail: environment.API_URL + post.thumbnail,
          }))
        );
      });

      forkJoin(postsWithTags$).subscribe((postsWithTags) => {
        this.dataPostPopular = postsWithTags;
      });
    });
  }
  

  pageChanged(event: any): void {
    this.pageIndex = event.page + 1;
    this.pageSize = event.rows;
    this.loadData();
  }
  getProductTag(tag: string) {
    this.postService.getPostsByTag(tag, 1).subscribe((res) => {
      this.dataPost = res.posts;
      this.dataPost.map((data) => {
        data.thumbnail = environment.API_URL + data.thumbnail;
      });
      console.log(this.dataPost);
    });
  }
  navigateToDetail(id: string | undefined) {
    this.router.navigate([`content/postdetail/${id}`]);
  }
}
