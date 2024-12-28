import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
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
import { TokenStorageService } from '../../Shared/Service/token.service';
import { UrlConstants } from '../../Shared/constants/Url.onstants';
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
    var user = this.tokenService.getUser();
    if (user == null) {
      this.router.navigate([UrlConstants.LOGIN]);
      return;
    }
  
    var permissions = JSON.parse(user?.permissions || '[]');
    for (var index = 0; index < navItems.length; index++) {
      var children = navItems[index]?.children ?? []; // Nếu `children` không tồn tại, sử dụng mảng rỗng
      for (var childIndex = 0; childIndex < children.length; childIndex++) {
        var child = children[childIndex];
        if (
          child?.attributes?.['policyName'] &&
          !permissions.includes(child.attributes['policyName'])
        ) {
          child.class = 'hidden'; // Gán class nếu không có quyền
        }
      }
    }
  
    this.navItems = navItems;
  }
  
}
