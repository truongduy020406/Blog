import { Component, computed, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../Views/Auth/Service/auth.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, MenubarModule,MenuModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  authService = inject(AuthService);
  items = [
    { label: 'Trang chủ', icon: 'pi pi-home', url: '/#/' },
    { label: 'Bài viết', icon: 'pi pi-pencil', url: '/#/post' },
    { label: 'Hỏi đáp', icon: 'pi pi-info-circle', url: '/about' }, 
  ];
  item = [
    { label: 'Hồ sơ', icon: 'pi pi-address-book', url: '/#/user/profile' },
    { label: 'Đăng xuất', icon: 'pi pi-sign-out', url: '/#/register' },
  ];

  write = [
    { label: 'Viết bài', icon: 'pi pi-home', url: '/#/post/newpost' },
    { label: 'Series mới', icon: 'pi pi-file-word', url: '/#/series' },
    { label: 'Câu hỏi', icon: 'pi pi-question-circle', url: '/#/register' },

  ];
  ngOnInit(): void {
    this.authService.getProfile().subscribe();
  }

  test() {
    this.authService.getProfile().subscribe((res) => {
      console.log(res);
    });
  }
}
