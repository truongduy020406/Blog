import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ProfileService } from '../Services/profile.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { PostService } from '../../Content/Services/post.service';
import { PostInListDto } from '../../Content/Model/PostInListDto.model';

import { CardModule } from 'primeng/card';
import { QuestionComponent } from '../question/question.component';
import { AlertService } from '../../../Shared/Service/alert.service';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageConstants } from '../../../Shared/constants/Message.constants';
import { PostDetailComponent } from '../../Content/post-detail/post-detail.component';
import { DialogService, DynamicDialogComponent } from 'primeng/dynamicdialog';
import { PostDto } from '../../Content/Model/PostDto.model';
import { takeUntil } from 'rxjs';
import { PostInListDtoPagedResult } from '../../Content/Model/PostInListDtoPagedResult.model';
import { PostDetailUpdateComponent } from '../../Content/post-detail-update/post-detail-update.component';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    PanelMenuModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    PasswordModule,
    FormsModule,
    CardModule,
    QuestionComponent,
    BlockUIModule,
    ProgressSpinnerModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  selectedItems: PostInListDto[] = [];
  items!: MenuItem[];
  selectedTab: string = '';
  userForm!: FormGroup;
  changePasswordForm!: FormGroup;
  userData: any;
  postPublic: PostInListDto[] = [];
  postPrivate: PostInListDto[] = [];
  blockedPanel: boolean = false;
  item: PostInListDto[] = [];
  keyword: string = '';
  pageIndex: number = 1;
  pageSize: number = 10;
  totalCount?: number ;
  categoryId: string = '';
  private fb = inject(FormBuilder);
  private ProfileService = inject(ProfileService);
  private postService = inject(PostService);
  private notificationService = inject(AlertService);
  private confirmationService = inject(ConfirmationService);
  private alertService = inject(AlertService)
  private dialogService = inject(DialogService)
  ngOnInit() {
    this.userForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
    this.items = [
      {
        label: 'Thông tin cá nhân',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Thông tin cá nhân',
            icon: 'pi pi-fw pi-trash',
            command: () => this.selectTab('Thông tin cá nhân'),
          },
          {
            separator: true,
          },
          {
            label: 'Thông tin liên hệ',
            icon: 'pi pi-fw pi-external-link',
            command: () => this.selectTab('Thông tin liên hệ'),
          },
          {
            label: 'Email',
            icon: 'pi pi-fw pi-external-link',
            command: () => this.selectTab('Email'),
          },
          {
            label: 'Mật khẩu',
            icon: 'pi pi-fw pi-external-link',
            command: () => this.selectTab('Mật khẩu'),
          },
        ],
      },
      {
        label: 'Bài Viết',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Bản nháp',
            icon: 'pi pi-fw pi-trash',
            command: () => this.selectTab('Bản nháp'),
          },
          {
            separator: true,
          },
          {
            label: 'Công khai',
            icon: 'pi pi-fw pi-external-link',
            command: () => this.selectTab('Công khai'),
          },
        ],
      },
      {
        label: 'Series',
        icon: 'pi pi-fw pi-pencil',
        command: () => this.selectTab('Series'),
      },
      {
        label: 'Câu trả lời',
        icon: 'pi pi-fw pi-user',
        command: () => this.selectTab('Câu trả lời'),
      },
      {
        label: 'Câu hỏi',
        icon: 'pi pi-fw pi-question',
        command: () => this.selectTab('Câu hỏi'),
      },
    ];

    this.ProfileService.getProfile().subscribe((res: any) => {
      this.userData = res;
      this.userForm.patchValue({
        firstName: this.userData.firstName,
        lastName: this.userData.lastName,
        email: this.userData.email,
      });
    });
    this.initForm();
    this.loadDataPublic();
    this.loadDataPrivate();

   
  }

  showEditModal(id:string) {
    const ref = this.dialogService.open(PostDetailUpdateComponent, {
      data: {
        id: id
      },
      header: 'Cập nhật bài viết',
      width: '70%'
    });
    const dialogRef = this.dialogService.dialogComponentRefMap.get(ref);
    const dynamicComponent = dialogRef?.instance as DynamicDialogComponent;
    const ariaLabelledBy = dynamicComponent.getAriaLabelledBy();
    dynamicComponent.getAriaLabelledBy = () => ariaLabelledBy;
    ref.onClose.subscribe((data: PostDto) => {
      if (data) {
        this.alertService.showSuccess(MessageConstants.UPDATED_OK_MSG);
      }
    });
  }
  
  loadDataPublic(){
    this.postService.getPostsUserPaging('', '', 1, 10).subscribe((res) => {
      res.results.forEach((data) => {
        if (data.status === 3) {
          this.postPublic.push(data);
        } 
      });
    });
  }

  loadDataPrivate(){
    this.postService.getPostsUserPaging('', '', 1, 10).subscribe((res) => {
      res.results.forEach((data) => {
        if (data.status === 0) {
          this.postPrivate.push(data);
        }
      });
    });
  }
  initForm(): void {
    this.changePasswordForm = this.fb.group(
      {
        oldPassword: ['', [Validators.required, Validators.minLength(6)]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      {
        validators: [this.passwordsMatch('newPassword', 'confirmPassword')],
      }
    );
  }

  onSubmitProfile(): void {
    if (this.userForm.valid) {
      console.log('Thông tin người dùng:', this.userForm.value);
    } else {
      console.log('Form không hợp lệ');
    }
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      const passwordData = this.changePasswordForm.value;
      this.ProfileService.changePassword(passwordData).subscribe((res) => {});
    }
  }

  passwordsMatch(newPassword: string, confirmPassword: string) {
    return (group: FormGroup) => {
      const newPasswordValue = group.controls[newPassword].value;
      const confirmPasswordValue = group.controls[confirmPassword].value;

      if (newPasswordValue !== confirmPasswordValue) {
        group.controls[confirmPassword].setErrors({ mismatch: true });
        return { mismatch: true };
      }
      return null;
    };
  }

  isPasswordChanged(): boolean {
    const originalData = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    return (
      this.changePasswordForm.value.oldPassword !== originalData.oldPassword ||
      this.changePasswordForm.value.newPassword !== originalData.newPassword ||
      this.changePasswordForm.value.confirmPassword !==
        originalData.confirmPassword
    );
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  // Hàm xử lý sự kiện khi chuyển tab
  onTabChange(event: any) {
  }

  approve(id: string) {
    this.postPrivate = this.postPrivate.filter(post => !id.includes(post.id)); 
    this.postService.approvePost(id).subscribe({
      next: (res) => {
        this.notificationService.showSuccess('Đăng bài thành công');
      },
      error: (err) => {
        this.notificationService.showError('Đăng bài không thành thành công');
      },
    });
  }

  updatePost(id: string) {

    
  }


  deleteItemsConfirm(ids: any[]) {
    this.toggleBlockUI(true);
    this.postPrivate = this.postPrivate.filter(post => !ids.includes(post.id)); 
    this.postPublic = this.postPublic.filter(post => !ids.includes(post.id)); 

    this.postService.deletePosts(ids).subscribe({
      next: () => {
        this.notificationService.showSuccess(MessageConstants.DELETED_OK_MSG);
        this.toggleBlockUI(false);
      },
      error: () => {
        this.toggleBlockUI(false);
      },
    });
  }
  deletePost(id: string) {
    this.confirmationService.confirm({
      message: MessageConstants.CONFIRM_DELETE_MSG,
      accept: () => {
        // Pass the single id to deleteItemsConfirm
        this.deleteItemsConfirm([id]);  // Pass id as an array
      },
    });
  }
  

  private toggleBlockUI(enabled: boolean) {
    if (enabled == true) {
      this.blockedPanel = true;
    } else {
      setTimeout(() => {
        this.blockedPanel = false;
      }, 1000);
    }
  }
}
