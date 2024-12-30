import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
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
    CardModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  items!: MenuItem[];
  selectedTab: string = '';
  userForm!: FormGroup;
  changePasswordForm!: FormGroup;
  userData: any;
  postPublic: PostInListDto[] = [];
  postPrivate: PostInListDto[]= [];

  private fb = inject(FormBuilder);
  private ProfileService = inject(ProfileService);
  private postService = inject(PostService);

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

    this.postService.getPostsPaging('', '', 1, 10).subscribe((res) => {
      res.results.forEach((data) => {
        if (data.status === 3) {
          this.postPublic.push(data); 
          console.log(this.postPublic)
        } else {
          this.postPrivate.push(data); 
          console.log(this.postPrivate);
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
      this.ProfileService.changePassword(passwordData).subscribe((res) => {
        console.log(res);
      });
    } else {
      console.log('Form is invalid');
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
    console.log('Tab changed:', event);
  }
}
