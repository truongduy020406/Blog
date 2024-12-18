import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { RoyaltyReportByMonthDto } from '../../Models/RoyaltyReportByMonthDto.model';
import { DialogService } from 'primeng/dynamicdialog';
import { AlertService } from '../../../../Shared/service/alert.service';
import { ConfirmationService } from 'primeng/api';
import { MessageConstants } from '../../../../Shared/constants/Message.constants';
import { RoyaltyService } from '../../Service/royalty.service';
import { PanelModule } from 'primeng/panel';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-royalty-month',
  standalone: true,
  imports: [BlockUIModule,
    ProgressSpinnerModule,
    TableModule,
    KeyFilterModule,
    BadgeModule,
    PanelModule,
    PaginatorModule,
    CommonModule,
    ButtonModule,
  ],
  templateUrl: './royalty-month.component.html',
  styleUrl: './royalty-month.component.scss'
})
export class RoyaltyMonthComponent {
   //System variables
  ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  items: RoyaltyReportByMonthDto[] = [];
  userName: string = '';
  fromMonth: number = 1;
  fromYear: number = new Date().getFullYear();
  toMonth: number = 12;
  toYear: number = new Date().getFullYear();
   constructor(
     private RoyaltyApiClient: RoyaltyService,
     public dialogService: DialogService,
     private alertService: AlertService,
     private confirmationService: ConfirmationService) { }
 
   ngOnDestroy(): void {
     this.ngUnsubscribe.next();
     this.ngUnsubscribe.complete();
   }
 
   ngOnInit() {
     this.loadData();
   }
 
   loadData() {
     this.toggleBlockUI(true);
 
     this.RoyaltyApiClient.getRoyaltyReportByMonth(this.userName, this.fromMonth, this.fromYear, this.toMonth, this.toYear)
       .pipe(takeUntil(this.ngUnsubscribe))
       .subscribe({
         next: (response: RoyaltyReportByMonthDto[]) => {
           this.items = response;
           this.toggleBlockUI(false);
         },
         error: () => {
           this.toggleBlockUI(false);
 
         }
       });
   }
   payForUser(userId: string) {
     this.confirmationService.confirm({
       message: "Bạn có chắc muốn thanh toán?",
       accept: () => {
         this.payConfirm(userId)
       }
     });
   }
 
   payConfirm(id: string) {
     this.toggleBlockUI(true);
 
     this.RoyaltyApiClient.payRoyalty(id)
       .subscribe({
         next: () => {
           this.alertService.showSuccess(MessageConstants.UPDATED_OK_MSG);
           this.loadData();
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
