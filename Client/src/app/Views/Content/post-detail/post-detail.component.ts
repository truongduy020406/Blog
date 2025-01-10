import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../Services/post.service';
import { CardModule } from 'primeng/card';
import { CommonModule, DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';
import TurndownService from 'turndown';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { CommentService } from '../Services/comment.service';
import { CreateUpdateCommentDto } from '../Model/CreateComment.model';
@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CardModule, DatePipe, MarkdownComponent, FormsModule,CommonModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
})
export class PostDetailComponent implements OnInit {
  postId!: string;
  dataPost?: any;
  data: any;
  tags: string[] | undefined;
  filteredTags: any;
  postTags: string[] = [];
  isDownClicked = false;
  isUpClicked = false;
  private route = inject(ActivatedRoute);
  private postService = inject(PostService);
  private commentService = inject(CommentService);

  private turndownService: TurndownService = new TurndownService();

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id')!;

    this.postService.getPostAndIncreaseView(this.postId).subscribe((res) => {
      this.dataPost = res;
      this.dataPost.thumbnail = environment.API_URL + res.thumbnail;

      let content = this.dataPost.content;
      let markdownContent = this.turndownService.turndown(content);

      this.dataPost.content = markdownContent
        .replace(/\\`\\`\\`/g, '```')
        .replace(/\n\s*\n/g, '\n');
    });

    this.postService.getAllTags().subscribe((res: any) => {
      this.tags = res;
    });
  }
  initialValue = 5;  // The initial starting value
  number = this.initialValue;
  onDownClick() {
    if (this.number > this.initialValue - 1) {
      this.number--;
    }
  }

  onUpClick() {
    if (this.number < this.initialValue + 1) {
      this.number++;
    }
  }
  filterTag(event: AutoCompleteCompleteEvent) {
    let filtered: string[] = [];
    let query = event.query;

    for (let i = 0; i < (this.tags as string[]).length; i++) {
      let tag = (this.tags as string[])[i];
      if (tag.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(tag);
      }
    }
    if (filtered.length == 0) {
      filtered.push(query);
    }
    this.filteredTags = filtered;
  }

  createComment() {
    const data: CreateUpdateCommentDto = {
      Content: '1232131',
      PostId: '0ce35e8f-8a87-41c5-8d29-165a814cf5ff',
    };
    this.commentService.createComment(data).subscribe((res) => {
      console.log(res);
    });
  }
}
