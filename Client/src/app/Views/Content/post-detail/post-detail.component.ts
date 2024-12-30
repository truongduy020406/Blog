import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../Services/post.service';
import { CardModule } from 'primeng/card';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';
import TurndownService from 'turndown';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CardModule, DatePipe, MarkdownComponent, FormsModule],
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
  private route = inject(ActivatedRoute);
  private postService = inject(PostService);
  private turndownService: TurndownService = new TurndownService();

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id')!;
    this.postService.getPostById(this.postId).subscribe((res) => {
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
}
