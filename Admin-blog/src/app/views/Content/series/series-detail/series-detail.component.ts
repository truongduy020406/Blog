import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PostDto } from '../../posts/Model/PostDto.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UtilityService } from '../../../../Shared/Service/utility.service';
import { SeriesService } from '../../Services/series.service';
import { UploadService } from '../../../../Shared/Service/upload.service';
import { SeriesDto } from '../Model/SeriesDto.model'
import { PanelModule } from 'primeng/panel';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputTextModule } from 'primeng/inputtext'; 
import { ValidationMessageComponent } from '../../../../Shared/modules/validation-message/validation-message.component'
import { ImageModule } from 'primeng/image';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { EditorModule } from 'primeng/editor';
@Component({
  selector: 'app-series-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PanelModule,
    KeyFilterModule,
    InputTextModule,
    ValidationMessageComponent,
    ImageModule,
    CommonModule,
    CheckboxModule,
    BlockUIModule,
    ProgressSpinnerModule,
    EditorModule
  ],
  templateUrl: './series-detail.component.html',
  styleUrl: './series-detail.component.scss'
})
export class SeriesDetailComponent {
  private ngUnsubscribe = new Subject<void>();

  // Default
  blockedPanelDetail: boolean = false;
  form!: FormGroup;
  title: string = '';
  btnDisabled = false;
  saveBtnName: string = '';
  postCategories: any[] = [];
  contentTypes: any[] = [];
  series: any[] = [];

  selectedEntity = {} as SeriesDto;
  thumbnailImage:any;

  formSavedEventEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private utilService: UtilityService,
    private fb: FormBuilder,
    private seriesApiClient: SeriesService,
    private uploadService: UploadService
  ) { }
  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public generateSlug() {
    var slug = this.utilService.makeSeoTitle(this.form.get('name')?.value);
    this.form.controls['slug'].setValue(slug);
  }
  // Validate
  noSpecial: RegExp = /^[^<>*!_~]+$/;
  validationMessages = {
    name: [
      { type: 'required', message: 'Bạn phải nhập tên' },
      { type: 'minlength', message: 'Bạn phải nhập ít nhất 3 kí tự' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 255 kí tự' },
    ],
    slug: [{ type: 'required', message: 'Bạn phải URL duy nhất' }],
    description: [{ type: 'required', message: 'Bạn phải nhập mô tả ngắn' }],
  };

  ngOnInit() {
    //Init form
    this.buildForm();
    this.toggleBlockUI(true);
    if (this.utilService.isEmpty(this.config.data?.id) == false) {
      this.loadFormDetails(this.config.data?.id);
    } else {
      this.toggleBlockUI(false);
    }
  }
  loadFormDetails(id: string) {
    this.seriesApiClient
      .getSeriesById(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: PostDto) => {
          this.selectedEntity = response;
          this.buildForm();
          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
  }


  onFileChange(event:any) {
    if (event.target.files && event.target.files.length) {
      this.uploadService.uploadImage('posts', event.target.files)
        .subscribe({
          next: (response: any) => {
            this.form.controls['thumbnail'].setValue(response.path);
            this.thumbnailImage = environment.API_URL + response.path;
          },
          error: (err: any) => {
            console.log(err);
          }
        });
    }
  }
  saveChange() {
    this.toggleBlockUI(true);
    this.saveData();
  }

  private saveData() {
    this.toggleBlockUI(true);
    if (this.utilService.isEmpty(this.config.data?.id)) {
      this.seriesApiClient
        .createSeries(this.form.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.ref.close(this.form.value);
            this.toggleBlockUI(false);
          },
          error: () => {
            this.toggleBlockUI(false);
          },
        });
    } else {
      this.seriesApiClient
        .updateSeries(this.config.data?.id, this.form.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.toggleBlockUI(false);

            this.ref.close(this.form.value);
          },
          error: () => {
            this.toggleBlockUI(false);
          },
        });
    }
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
  buildForm() {
    this.form = this.fb.group({
      name: new FormControl(
        this.selectedEntity.name || null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(255),
          Validators.minLength(3),
        ])
      ),
      slug: new FormControl(this.selectedEntity.slug || null, Validators.required),
      description: new FormControl(this.selectedEntity.description || null, Validators.required),
      seoDescription: new FormControl(this.selectedEntity.seoDescription || null),
      content: new FormControl(this.selectedEntity.content || null),
      isActive: new FormControl(this.selectedEntity.isActive ?? false),
      thumbnail: new FormControl(
        this.selectedEntity.thumbnail || null
      ),
    });
    if (this.selectedEntity.thumbnail) {
      this.thumbnailImage = environment.API_URL + this.selectedEntity.thumbnail;
    }
  }
}
