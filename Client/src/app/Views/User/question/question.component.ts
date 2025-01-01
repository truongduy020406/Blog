import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogComponent } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { AlertService } from '../../../Shared/Service/alert.service';
import { ConfirmationService } from 'primeng/api';
import { QuestionDetailComponent } from '../question-detail/question-detail.component';
import { MessageConstants } from '../../../Shared/constants/Message.constants';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { PaginatorModule } from 'primeng/paginator';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { QuestionService } from '../Services/question.service';
import { questionDTO } from '../Models/question.model';

@Component({
  selector: 'app-question',
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
    CheckboxModule,
  ],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss',
})
export class QuestionComponent implements OnInit {
   //System variables
    ngUnsubscribe = new Subject<void>();
    blockedPanel: boolean = false;
  
    //Paging variables
    pageIndex: number = 1;
    pageSize: number = 10;
    totalCount?: number;
  
    //Business variables
    items: questionDTO[] = [];
    selectedItems: questionDTO[] = [];
    keyword: string = '';
  
    constructor(
      private questionService: QuestionService,
      public dialogService: DialogService,
      private notificationService: AlertService,
      private confirmationService: ConfirmationService) { }
  
    ngOnDestroy(): void {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    }
  
    ngOnInit() {
      this.loadData();
      this.questionService.getQuestionById('87ffe442-6299-4ea6-b644-c603888dca1d').subscribe(res => {
        console.log(res)
      })
    }
  
    loadData(selectionId: string | null | undefined = null) {
      this.toggleBlockUI(true);
  
      this.questionService.getQuestionByUserPaging(this.keyword, this.pageIndex, this.pageSize)
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
      const ref = this.dialogService.open(QuestionDetailComponent, {
        header: 'Thêm mới series bài viết',
        width: '70%'
      });
      const dialogRef = this.dialogService.dialogComponentRefMap.get(ref);
      const dynamicComponent = dialogRef?.instance as DynamicDialogComponent;
      const ariaLabelledBy = dynamicComponent.getAriaLabelledBy();
      dynamicComponent.getAriaLabelledBy = () => ariaLabelledBy;
      ref.onClose.subscribe((data: questionDTO) => {
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
      var id = this.selectedItems[0].questionId;
      const ref = this.dialogService.open(QuestionDetailComponent, {
        data: {
          id: id
        },
        header: 'Cập nhật Question',
        width: '70%'
      });
      const dialogRef = this.dialogService.dialogComponentRefMap.get(ref);
      const dynamicComponent = dialogRef?.instance as DynamicDialogComponent;
      const ariaLabelledBy = dynamicComponent.getAriaLabelledBy();
      dynamicComponent.getAriaLabelledBy = () => ariaLabelledBy;
      ref.onClose.subscribe((data: questionDTO) => {
        if (data) {
          this.notificationService.showSuccess(MessageConstants.UPDATED_OK_MSG);
          this.selectedItems = [];
          this.loadData(data.questionId);
          console.log(this.loadData(data.questionId))
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
        ids.push(element.questionId);
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
  
      this.questionService.deleteSeries(ids)
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
