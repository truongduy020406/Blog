import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../Services/post.service';
import { CardModule } from 'primeng/card';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    CardModule,
    DatePipe
  ],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
})
export class PostDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private postService = inject(PostService)
  unsafeHtml = "<p>test33</p>";
  postId!: string;
  dataPost:any;
  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id')!;
    console.log(this.postId)
    this.postService.getPostById(this.postId).subscribe(res => {
      this.dataPost = res
      console.log(res)
    })
  } 
}
