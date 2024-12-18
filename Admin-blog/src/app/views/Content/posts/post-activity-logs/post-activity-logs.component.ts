import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { PostActivityLogDto } from '../Model/PostActivityLogDto.model';
import { PostService } from '../Services/post.service'
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-post-activity-logs',
  standalone: true,
  imports: [
    PanelModule,
    TableModule,
    BadgeModule,
    BlockUIModule,
    ProgressSpinnerModule,
    DatePipe
  ],
  templateUrl: './post-activity-logs.component.html',
  styleUrl: './post-activity-logs.component.scss'
})
export class PostActivityLogsComponent {
  private ngUnsubscribe = new Subject<void>();

  // Default
  blockedPanelDetail: boolean = false;
  title: string = '';
  btnDisabled = false;
  saveBtnName: string = '';
  items: any[] = [];
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private postApiClient: PostService,
  ) { }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  ngOnInit() {
    //Load data to form
    this.toggleBlockUI(true);
    this.postApiClient.getActivityLogs(this.config.data.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (repsonse: PostActivityLogDto[]) => {
          this.items = repsonse;
          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
  }

  private toggleBlockUI(enabled: boolean) {
    if (enabled == true) {
      this.btnDisabled = true;
      this.blockedPanelDetail = true;
    } else {
      setTimeout(() => {
        this.btnDisabled = false;
        this.blockedPanelDetail = false;
      }, 1000);
    }
  }
}
