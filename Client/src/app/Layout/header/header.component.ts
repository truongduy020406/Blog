import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../Views/Auth/Service/auth.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, MenubarModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService)
  name:string = "";
  user:any = "";
  items = [
    { label: 'Home', icon: 'pi pi-home', url: '/#/' },
    { label: 'Posts', icon: 'pi pi-pencil', url: '/#/post' },
    { label: 'About', icon: 'pi pi-info-circle', url: '/about' },
    { label: 'Contact', icon: 'pi pi-phone', url: '/contact' },
  ];

  ngOnInit(): void {
    this.authService.getProfile().subscribe(res => {
      console.log(res)
    })
  }

  test(){
    this.authService.getProfile().subscribe(res => {
      console.log(res)
    })
  }
}
