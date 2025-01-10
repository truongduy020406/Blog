import { Component, inject, OnInit } from '@angular/core';
import { QuestionService } from '../../User/Services/question.service';
import { questionDTO } from '../../User/Models/question.model';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CommonModule, DatePipe } from '@angular/common';
import { PostService } from '../Services/post.service';
import { Router } from '@angular/router';
import { PostInListDto } from '../Model/PostInListDto.model';
import { forkJoin, map } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-all-question',
  standalone: true,
  imports: [DataViewModule, TagModule, ButtonModule, CommonModule, DatePipe],
  templateUrl: './all-question.component.html',
  styleUrl: './all-question.component.scss',
})
export class AllQuestionComponent implements OnInit {
  dataQuestion:questionDTO[] = []
  dataPost: PostInListDto[] = [];

  pageIndex: number = 1;
    pageSize: number = 10;
    totalCount?: number;
    private postService = inject(PostService);
    private router = inject(Router);
    private questionService = inject(QuestionService);

  ngOnInit(): void {
    this.loadQuestion();
    this.loadData();
  }

  loadQuestion() {
      this.questionService.getLastQuestion().subscribe((res) => {
        this.dataQuestion = res;
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
              tags, 
            }))
          );
        });
  
        forkJoin(postsWithTags$).subscribe((postsWithTags) => {
          this.dataPost = postsWithTags;
        });
      });
    }

    
  pageChanged(event: any): void {
    this.pageIndex = event.page + 1;
    this.pageSize = event.rows;
    this.loadData();
  }

  navigateToDetail(id: string | undefined) {
    this.router.navigate([`content/postdetail/${id}`]);
  }
  navigateToQuestionDetail(id: string | undefined) {
    this.router.navigate([`content/QuestionC/${id}`]);
  }
}
