import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '../Services/post.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PostInListDto } from '../Model/PostInListDto.model';
import { environment } from '../../../../environments/environment';
import { forkJoin, map, tap } from 'rxjs';
import { PaginatorModule } from 'primeng/paginator';
@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CardModule, ButtonModule, CommonModule, PaginatorModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
})
export class PostsComponent implements OnInit {
  dataPost?: PostInListDto[];
  pageIndex: number = 1;
  pageSize: number = 10;
  totalCount?: number;
  private postServive = inject(PostService);
  private router = inject(Router);
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.postServive
      .getPostsPaging('', '', this.pageIndex, this.pageSize)
      .subscribe((res) => {
        this.dataPost = res.results.filter((data) => data.status === 3);
        this.totalCount = this.dataPost.length;
        const postsWithTags$ = this.dataPost.map((post) => {
          return this.postServive.getPostTags(post.id).pipe(
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
  navigateToDetail(id: string | undefined) {
    this.router.navigate([`/content/postdetail/${id}`]);
  }

  pageChanged(event: any): void {
    this.pageIndex = event.page + 1;
    this.pageSize = event.rows;
    this.loadData();
  }

  
}
