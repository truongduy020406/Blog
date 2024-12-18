import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TransactionDto } from '../Models/TransactionDto.model';
import { RoyaltyService } from '../Service/royalty.service';
import { DialogService } from 'primeng/dynamicdialog';
import { TransactionDtoPagedResult } from '../Models/TransactionDtoPagedResult.model';
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
  selector: 'app-transaction',
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
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss'
})
export class TransactionComponent {
  //System variables
  ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;

  //Paging variables
  pageIndex: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;

  items: TransactionDto[] = [];
  userName: string = '';
  fromMonth: number = 1;
  fromYear: number = new Date().getFullYear();
  toMonth: number = 12;
  toYear: number = new Date().getFullYear();
  constructor(
    private RoyaltyApiClient: RoyaltyService,
    public dialogService: DialogService
  ) {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.loadData();
  }
  pageChanged(event: any): void {
    this.pageIndex = event.page + 1;
    this.pageSize = event.rows;
    this.loadData();
  }

  loadData() {
    this.toggleBlockUI(true);

    this.RoyaltyApiClient.getTransactionHistory(
      this.userName,
      this.fromMonth,
      this.fromYear,
      this.toMonth,
      this.toYear,
      this.pageIndex,
      this.pageSize
    )
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: TransactionDtoPagedResult) => {
          this.items = response.results;
          this.totalCount = response.rowCount;
          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
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
}
