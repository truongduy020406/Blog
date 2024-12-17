import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { RoleDto } from '../Model/RoleDto.model'
import { RoleDtoPagedResult } from '../Model/RoleDtoPagedResult.model'
import { RoleService } from '../Services/role.service'
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AlertService } from '../../../shared/service/alert.service';
import { MessageConstants } from '../../../Shared/constants/Message.constants'
import { DialogService, DynamicDialogComponent } from 'primeng/dynamicdialog';
import { RoleDetailComponent } from './role-detail/role-detail.component'
import { ConfirmationService } from 'primeng/api';
import { PermissionGrantComponent } from './permission-grant/permission-grant.component'
@Component({
  selector: 'app-role',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    TableModule,
    ProgressSpinnerModule,
    BlockUIModule,
    PaginatorModule,
    PanelModule,
    CheckboxModule,
    ButtonModule,
    InputTextModule],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent  implements OnInit, OnDestroy{
  ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;

  //Paging variables
  pageIndex: number = 1;
  pageSize: number = 10;
  totalCount: number | undefined = 0;

  //Business variables
  items: RoleDto[] | undefined = [];
  selectedItems: RoleDto[] = [];
  keyword: string = '';

  private roleService = inject(RoleService)
  private alertService = inject(AlertService)
  private dialogService = inject(DialogService)
  private confirmationService = inject(ConfirmationService) 

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.toggleBlockUI(true);

    this.roleService
      .getRolesAllPaging(this.keyword, this.pageIndex, this.pageSize)
      .subscribe({
        next: (response: RoleDtoPagedResult) => {
          console.log(response)
          this.items = response.results;
          this.totalCount = response.rowCount;

          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
  }

  pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.pageSize = event.rows;
    this.loadData();
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
  
  showPermissionModal(id: string, name: string) {
    const ref = this.dialogService.open(PermissionGrantComponent, {
      data: {
          id: id,
      },
      header: name,
      width: '70%',
  });
  const dialogRef = this.dialogService.dialogComponentRefMap.get(ref);
  const dynamicComponent = dialogRef?.instance as DynamicDialogComponent;
  const ariaLabelledBy = dynamicComponent.getAriaLabelledBy();
  dynamicComponent.getAriaLabelledBy = () => ariaLabelledBy;
  ref.onClose.subscribe((data: RoleDto) => {
      if (data) {
          this.alertService.showSuccess(
              MessageConstants.UPDATED_OK_MSG
          );
          this.selectedItems = [];
          this.loadData();
      }
  });
  }
  
  showEditModal() {
    if (this.selectedItems.length == 0) {
      this.alertService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    var id = this.selectedItems[0].id;
    const ref = this.dialogService.open(RoleDetailComponent, {
      data: {
        id: id,
      },
      header: 'Cập nhật quyền',
      width: '70%',
    });
    const dialogRef = this.dialogService.dialogComponentRefMap.get(ref);
    const dynamicComponent = dialogRef?.instance as DynamicDialogComponent;
    const ariaLabelledBy = dynamicComponent.getAriaLabelledBy();
    dynamicComponent.getAriaLabelledBy = () => ariaLabelledBy;
    ref.onClose.subscribe((data: RoleDto) => {
      if (data) {
        this.alertService.showSuccess(MessageConstants.UPDATED_OK_MSG);
        this.selectedItems = [];
        this.loadData();
      }
    });
  }
  showAddModal() {
    const ref = this.dialogService.open(RoleDetailComponent, {
      header: 'Thêm mới quyền',
      width: '70%',
    });
    const dialogRef = this.dialogService.dialogComponentRefMap.get(ref);
    const dynamicComponent = dialogRef?.instance as DynamicDialogComponent;
    const ariaLabelledBy = dynamicComponent.getAriaLabelledBy();
    dynamicComponent.getAriaLabelledBy = () => ariaLabelledBy;
    ref.onClose.subscribe((data: RoleDto) => {
      if (data) {
        this.alertService.showSuccess(MessageConstants.CREATED_OK_MSG);
        this.selectedItems = [];
        this.loadData();
      }
    });
  }
  deleteItems() {
    if (this.selectedItems.length == 0) {
        this.alertService.showError(
            MessageConstants.NOT_CHOOSE_ANY_RECORD
        );
        return;
    }
    var ids:any = [];
    this.selectedItems.forEach((element) => {
        ids.push(element.id);
    });
    this.confirmationService.confirm({
        message: MessageConstants.CONFIRM_DELETE_MSG,
        accept: () => {
            this.deleteItemsConfirm(ids);
        },
    });
}

deleteItemsConfirm(ids: any[]) {
    this.toggleBlockUI(true);

    this.roleService.deleteRoles(ids).subscribe({
        next: () => {
            this.alertService.showSuccess(
                MessageConstants.DELETED_OK_MSG
            );
            this.loadData();
            this.selectedItems = [];
            this.toggleBlockUI(false);
        },
        error: () => {
            this.toggleBlockUI(false);
        },
    });
}
}
