import { Component } from '@angular/core';
import { PostInListDto } from '../../posts/Model/PostInListDto.model';
import { Subject, takeUntil } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SeriesService } from '../../Services/series.service';
import { AlertService } from '../../../../Shared/service/alert.service';
import { AddPostSeriesRequest } from '../Model/AddPostSeriesRequest.model';
import { MessageConstants } from '../../../../Shared/constants/Message.constants';
import { PanelModule } from 'primeng/panel';
import { BlockUIModule } from 'primeng/blockui';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-series-posts',
  standalone: true,
  imports: [
    PanelModule,
    BlockUIModule,
    TableModule,
    ProgressSpinnerModule,
    ButtonModule
  ],
  templateUrl: './series-posts.component.html',
  styleUrl: './series-posts.component.scss'
})
export class SeriesPostsComponent {
  private ngUnsubscribe = new Subject<void>();

  blockedPanel: boolean = false;
  title: string = '';
  posts: PostInListDto[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private seriesApiClient: SeriesService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.initData();
  }
  initData() {
    this.toggleBlockUI(true);
    this.loadData(this.config.data?.id);
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadData(id: string) {
    this.toggleBlockUI(true);

    this.seriesApiClient.getPostsInSeries(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: PostInListDto[]) => {
          this.posts = response;
          console.log(this.posts)
          this.toggleBlockUI(false);
        },
        error: (error) => {
          this.toggleBlockUI(false);
        }
      }
      );
  }
  removePost(id: string) {
    var body: AddPostSeriesRequest = {
      postId: id,
      seriesId: this.config.data.id
    };
    this.seriesApiClient
      .deletePostSeries(body)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.alertService.showSuccess(MessageConstants.DELETED_OK_MSG);
          this.loadData(this.config.data?.id);
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
