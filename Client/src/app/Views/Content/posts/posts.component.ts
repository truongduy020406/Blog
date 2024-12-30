import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '../Services/post.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PostInListDto } from '../Model/PostInListDto.model';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    CommonModule
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit {
  dataPost?:PostInListDto[];
  private postServive = inject(PostService)
  private router = inject(Router)
  ngOnInit(): void {
    this.postServive.getPostsPaging("","",1,10).subscribe({
      next: (res) => {
        this.dataPost  = res.results.filter(data => data.status === 3);;
        this.dataPost.map(data => {
          data.thumbnail = environment.API_URL + data.thumbnail
        })
      },
      error:(e)=> {
        console.log(e)
      }
    })
  }
  navigateToDetail(id:string|undefined){
    this.router.navigate([`post/detail/${id}`])
  }
}
