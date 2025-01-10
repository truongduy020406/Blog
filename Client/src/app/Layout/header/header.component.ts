import { Component, computed, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../Views/Auth/Service/auth.service';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, MenubarModule,MenuModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  authService = inject(AuthService);
  private router = inject(Router);

  items = [
    { label: 'Trang chủ', icon: 'pi pi-home', url: '/#/' },
    { label: 'Bài viết', icon: 'pi pi-pencil', url: '/#/content/post' },
    { label: 'Hỏi đáp', icon: 'pi pi-info-circle', url: '/#/content/allQuestion' }, 
  ];
  item = [
    { label: 'Hồ sơ', icon: 'pi pi-address-book', url: '/#/user/profile' },
    { label: 'Đăng xuất', icon: 'pi pi-sign-out', command: () => this.logout() },
  ];

  write = [
    { label: 'Viết bài', icon: 'pi pi-home', url: '/#/content/newpost' },
    { label: 'Series mới', icon: 'pi pi-file-word', url: '/#/series' },
    { label: 'Câu hỏi', icon: 'pi pi-question-circle', url: '/#/user/question' },

  ];
  ngOnInit(): void {
    if(localStorage.getItem('auth-token')){
      this.authService.getProfile().subscribe()
    }
  }



  logout() {
    this.authService.logout() 
    this.router.navigate(['/Auth/login']); 
  }
}
