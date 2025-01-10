import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommentService } from '../Services/comment.service';
import { AlertService } from '../../../Shared/Service/alert.service';
import { PanelModule } from 'primeng/panel';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-comment-detail',
  standalone: true,
  imports: [
    PanelModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule
  ],
  templateUrl: './comment-detail.component.html',
  styleUrl: './comment-detail.component.scss'
})
export class CommentDetailComponent {
  form!: FormGroup;
  commentId: string = '';
  originalComment: string = '';
  btnDisabled: boolean = false;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private commentService: CommentService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.commentId = this.config.data.commentId; 
    this.originalComment = this.config.data.commentText; 
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      content: new FormControl(this.originalComment, Validators.required),
    });
  }

  saveChanges() {
    if (this.form.invalid) return;
    this.btnDisabled = true;
    
    const updatedComment = {
      content:this.form.value.content
    }
    
    this.commentService
      .updateComment(this.commentId, updatedComment)
      .subscribe({
        next: () => {
          this.alertService.showSuccess('Cập nhật bình luận thành công');
          this.ref.close(updatedComment); // Đóng dialog và trả lại nội dung mới
        },
        error: (err) => {
          this.btnDisabled = false;
          this.alertService.showError('Cập nhật bình luận thất bại');
        },
      });
  }

  closeDialog() {
    this.ref.close(); // Đóng dialog nếu không muốn lưu thay đổi
  }
}
