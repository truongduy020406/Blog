import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { INavData } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';
import { TokenStorageService } from '../../shared/service/token.service';
import { UrlConstants } from '../../shared/constants/Url.onstants';
import { CommonModule } from '@angular/common';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  standalone: true,
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    RouterLink,
    IconDirective,
    NgScrollbar,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    DefaultHeaderComponent,
    ShadowOnScrollDirective,
    ContainerComponent,
    RouterOutlet,
    DefaultFooterComponent,
    CommonModule
  ]
})
export class DefaultLayoutComponent implements OnInit {
  public navItems: any = []; 

  constructor(
    private tokenService: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.tokenService.getUser();
    if (!user) {
      this.router.navigate([UrlConstants.LOGIN]);
      return; 
    }

    const permissions = user.permissions ? JSON.parse(user.permissions) : []; 

    for (let index = 0; index < navItems.length; index++) {
      const children = navItems[index].children ?? []; 

      for (let childIndex = 0; childIndex < children.length; childIndex++) {
        const child = children[childIndex];
        const policyName = child.attributes?.['policyName']; // Sử dụng optional chaining
        if (policyName && !permissions.includes(policyName)) {
          child.class = 'hidden'; // Gán class là 'hidden' nếu không có quyền
        }
      }
    }

    this.navItems = navItems; // Gán navItems sau khi xử lý
  }
}
