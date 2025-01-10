import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
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
import { LikeService } from '../Services/like.service';
import { AuthService } from '../../Auth/Service/auth.service';
import { CommentDetailComponent } from '../comment-detail/comment-detail.component';
import { DialogService } from 'primeng/dynamicdialog';
import { AlertService } from '../../../Shared/Service/alert.service';
import { ConfirmationService } from 'primeng/api';
import { MessageConstants } from '../../../Shared/constants/Message.constants';
@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CardModule, DatePipe, MarkdownComponent, FormsModule, CommonModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
})
export class PostDetailComponent implements OnInit, AfterViewInit {
  postId!: string;
  dataPost?: any;
  data: any;
  tags: string[] | undefined;
  filteredTags: any;
  postTags: string[] = [];
  isDownClicked = false;
  isUpClicked = false;
  toc: any[] = [];
  selectedHeaderId: string | null = null;
  countLike: number = 0;
  userId: string | null = '';
  islike: boolean = false;

  dataComment: CreateUpdateCommentDto[] = [];
  newComment: CreateUpdateCommentDto = {
    content: '',
    PostId: '',
  };
  blockedPanel: boolean = false;

  private route = inject(ActivatedRoute);
  private postService = inject(PostService);
  private commentService = inject(CommentService);
  private cdRef = inject(ChangeDetectorRef);
  private likeService = inject(LikeService);
  private authService = inject(AuthService);
  public dialogService = inject(DialogService);
  private notificationService = inject(AlertService);
  private confirmationService = inject(ConfirmationService);

  private turndownService: TurndownService = new TurndownService();

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id')!;
    this.userId = this.authService.getUserID();
    console.log(this.authService.getUserID());

    this.getCommentWithIdPost(this.postId);
    this.likeService.getStatusLikePosst(this.postId).subscribe((res) => {
      this.islike = res.liked;
    });
    this.countLikePost();

    this.postService.getPostAndIncreaseView(this.postId).subscribe((res) => {
      this.dataPost = res;
      this.dataPost.thumbnail = environment.API_URL + res.thumbnail;

      let content = this.dataPost.content;
      let markdownContent = this.turndownService.turndown(content);

      this.dataPost.content = markdownContent
        .replace(/\\`\\`\\`/g, '```')
        .replace(/```([\s\S]*?)```/g, (match, codeBlock) => {
          let cleanedCodeBlock = codeBlock.replace(/\n\s*\n/g, '\n');
          return `\`\`\`${cleanedCodeBlock}\`\`\``;
        });
    });

    this.postService.getAllTags().subscribe((res: any) => {
      this.tags = res;
    });
  }

  extractHeaders() {
    const contentElement = document.querySelector('.content');
    if (contentElement) {
      const headers = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');

      if (headers.length > 0) {
        this.toc = Array.from(headers).map((header: Element) => {
          const headerElement = header as HTMLElement;
          const id =
            headerElement.id ||
            headerElement.innerText.replace(/\s+/g, '-').toLowerCase();

          if (!headerElement.id) {
            headerElement.id = id;
          }

          return {
            text: headerElement.innerText,
            id: id,
          };
        });
      }
    }
  }

  scrollToElement(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.selectedHeaderId = elementId;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.cdRef.detectChanges();
      this.extractHeaders();
    }, 100);
  }

  getCommentWithIdPost(idPost: string) {
    this.commentService.getComment(idPost).subscribe((res) => {
      this.dataComment = res;
      console.log(res);
    });
  }

  onAddComment() {
    if (!this.newComment.content?.trim()) {
      alert('Comment content cannot be empty.');
      return;
    }
    this.newComment.PostId = this.postId;
    this.commentService.createComment(this.newComment).subscribe((res) => {
      this.newComment.content = '';
      this.getCommentWithIdPost(this.postId);

      console.log(res);
    });
  }
  countLikePost() {
    this.likeService.countLike(this.postId).subscribe((res) => {
      this.countLike = res.likeCount;
    });
  }
  onDownClick() {
    if (this.islike) {
      this.likeService.deletePost(this.postId).subscribe({
        next: (res) => {
          this.islike = false;
          this.countLikePost();
        },
        error: (res) => {
          console.log(res);
        },
      });
    }
  }

  onUpClick() {
    this.likeService.LikePost(this.postId).subscribe((res) => {
      this.islike = true;
      this.countLikePost();
    });
  }

  onReplyClick(commentId?: string) {
    console.log(`Reply to comment: ${commentId}`);
  }

  // Xử lý khi người dùng nhấn nút Edit
  onEditClick(comment: any) {
    console.log(comment);

    const ref = this.dialogService.open(CommentDetailComponent, {
      header: 'Chỉnh sửa bình luận',
      width: '50%',
      data: {
        commentId: comment.id,
        commentText: comment.content,
      },
    });

    ref.onClose.subscribe((updatedComment: string) => {
      if (updatedComment) {
        this.getCommentWithIdPost(this.postId);
      }
    });
  }

  deleteItemsConfirm(id?: string) {
    this.toggleBlockUI(true);
    this.commentService.DeleteComment(id)
      .subscribe({
        next: () => {
          this.notificationService.showSuccess(MessageConstants.DELETED_OK_MSG);
          this.getCommentWithIdPost(this.postId)
          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        }
      });
  }

  onDeleteClick(commentId?: string) {
    this.confirmationService.confirm({
      message: MessageConstants.CONFIRM_DELETE_MSG,
      accept: () => {
        this.deleteItemsConfirm(commentId);
      },
    });
    console.log(commentId);
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

  private toggleBlockUI(enabled: boolean) {
    if (enabled == true) {
      this.blockedPanel = true;
    }
    else {
      setTimeout(() => {
        this.blockedPanel = false;
      }, 1000);
    }

  }
}
