import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DialogService, DynamicDialogComponent } from 'primeng/dynamicdialog';

import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SeriesInListDto } from './Model/SeriesInListDto.model';
import { ConfirmationService } from 'primeng/api';
import { SeriesDetailComponent } from './series-detail/series-detail.component';
import { SeriesDto } from './Model/SeriesDto.model';
import { SeriesPostsComponent } from './series-posts/series-posts.component';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { SeriesService } from './Services/series.service';
import { AlertService } from '../../Shared/Service/alert.service';
import { MessageConstants } from '../../Shared/constants/Message.constants';
import { CheckboxModule } from 'primeng/checkbox';
@Component({
  selector: 'app-series',
  standalone: true,
  imports: [
    PanelModule,
    TableModule,
    BlockUIModule,
    ProgressSpinnerModule,
    CommonModule,
    BadgeModule,
    PaginatorModule,
    ButtonModule,
    CheckboxModule
  ],
  templateUrl: './series.component.html',
  styleUrl: './series.component.scss'
})
export class SeriesComponent implements OnInit, OnDestroy {

  //System variables
  ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;

  //Paging variables
  pageIndex: number = 1;
  pageSize: number = 10;
  totalCount?: number;

  //Business variables
  items: SeriesInListDto[] = [];
  selectedItems: SeriesInListDto[] = [];
  keyword: string = '';

  constructor(
    private seriesApiClient: SeriesService,
    public dialogService: DialogService,
    private notificationService: AlertService,
    private confirmationService: ConfirmationService) { }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.loadData();
  }

  loadData(selectionId: string | null | undefined = null) {
    this.toggleBlockUI(true);

    this.seriesApiClient.getSeriesUserPaging(this.keyword, this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.items = response.results;
          console.log(this.items)
          this.totalCount = response.rowCount;
          this.toggleBlockUI(false);
        }
        ,
        error: () => {
          this.toggleBlockUI(false);

        }
      });
  }

  showAddModal() {
    const ref = this.dialogService.open(SeriesDetailComponent, {
      header: 'Thêm mới series bài viết',
      width: '70%'
    });
    const dialogRef = this.dialogService.dialogComponentRefMap.get(ref);
    const dynamicComponent = dialogRef?.instance as DynamicDialogComponent;
    const ariaLabelledBy = dynamicComponent.getAriaLabelledBy();
    dynamicComponent.getAriaLabelledBy = () => ariaLabelledBy;
    ref.onClose.subscribe((data: SeriesDto) => {
      if (data) {
        this.notificationService.showSuccess(MessageConstants.CREATED_OK_MSG);
        this.selectedItems = [];
        this.loadData();
      }
    });
  }

  pageChanged(event: any): void {
    this.pageIndex = event.page + 1;
    this.pageSize = event.rows;
    this.loadData();
  }

  showEditModal() {
    if (this.selectedItems.length == 0) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    var id = this.selectedItems[0].id;
    const ref = this.dialogService.open(SeriesDetailComponent, {
      data: {
        id: id
      },
      header: 'Cập nhật series bài viết',
      width: '70%'
    });
    const dialogRef = this.dialogService.dialogComponentRefMap.get(ref);
    const dynamicComponent = dialogRef?.instance as DynamicDialogComponent;
    const ariaLabelledBy = dynamicComponent.getAriaLabelledBy();
    dynamicComponent.getAriaLabelledBy = () => ariaLabelledBy;
    ref.onClose.subscribe((data: SeriesDto) => {
      if (data) {
        this.notificationService.showSuccess(MessageConstants.UPDATED_OK_MSG);
        this.selectedItems = [];
        this.loadData(data.id);
        
      }
    });
  }

  showPosts() {
    if (this.selectedItems.length == 0) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    var id = this.selectedItems[0].id;
    const ref = this.dialogService.open(SeriesPostsComponent, {
      data: {
        id: id
      },
      header: 'Quản lý danh sách bài viết',
      width: '70%'
    });
    const dialogRef = this.dialogService.dialogComponentRefMap.get(ref);
    const dynamicComponent = dialogRef?.instance as DynamicDialogComponent;
    const ariaLabelledBy = dynamicComponent.getAriaLabelledBy();
    dynamicComponent.getAriaLabelledBy = () => ariaLabelledBy;
    ref.onClose.subscribe((data: SeriesDto) => {
      if (data) {
        this.notificationService.showSuccess(MessageConstants.UPDATED_OK_MSG);
        this.selectedItems = [];
        this.loadData(data.id);
      }
    });
  }

  deleteItems() {
    if (this.selectedItems.length == 0) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    var ids:any = [];
    this.selectedItems.forEach(element => {
      ids.push(element.id);
    });
    this.confirmationService.confirm({
      message: MessageConstants.CONFIRM_DELETE_MSG,
      accept: () => {
        this.deleteItemsConfirm(ids)
      }
    });
  }

  deleteItemsConfirm(ids: any[]) {
    this.toggleBlockUI(true);

    this.seriesApiClient.deleteSeries(ids)
      .subscribe({
        next: () => {
          this.notificationService.showSuccess(MessageConstants.DELETED_OK_MSG);
          this.loadData();
          this.selectedItems = [];
          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        }
      });
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