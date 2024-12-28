import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '../Services/post.service';
import { PostInListDtoPagedResult } from '../Models/PostInListDtoPagedResult.model';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  dataPost?:PostInListDtoPagedResult;
  private postServive = inject(PostService)
  private router = inject(Router)
  ngOnInit(): void {
    this.postServive.getPostsPaging("","",1,10).subscribe({
      next: (res) => {
        this.dataPost  = res;
        console.log(res)
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
