import { Component, EventEmitter } from '@angular/core';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { PostDto } from '../Model/PostDto.model';
import { PostCategoryDto } from '../Model/PostCategoryDto.model';
import { UploadService } from '../../../Shared/Service/upload.service';
import { PostCategoryService } from '../Services/post-category.service';
import { PostService } from '../Services/post.service';
import { UtilityService } from '../../../Shared/Service/utility.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';

import { CommonModule, DatePipe } from '@angular/common';

import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ImageModule } from 'primeng/image';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputTextModule } from 'primeng/inputtext';
import { ValidationMessageComponent } from '../../../Shared/modules/validation-message/validation-message.component';
import { EditorModule } from 'primeng/editor';

@Component({
  selector: 'app-post-detail-update',
  standalone: true,
  imports: [
    PanelModule,
    ReactiveFormsModule,
    CommonModule,
    ImageModule,
    BlockUIModule,
    ProgressSpinnerModule,
    KeyFilterModule,
    InputTextModule,
    ValidationMessageComponent,
    DropdownModule,
    EditorModule,
    AutoCompleteModule
  ],
  templateUrl: './post-detail-update.component.html',
  styleUrl: './post-detail-update.component.scss'
})
export class PostDetailUpdateComponent {
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

  selectedEntity = {} as PostDto;
  thumbnailImage:any;

  tags: string[] | undefined;
  filteredTags: any;
  postTags: string[] = [];
  formSavedEventEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private utilService: UtilityService,
    private fb: FormBuilder,
    private postApiClient: PostService,
    private postCategoryApiClient: PostCategoryService,
    private uploadService: UploadService
  ) {}
  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public generateSlug() {
    if (this.form) {
      const slug = this.utilService.makeSeoTitle(this.form.get('name')?.value);
      this.form.controls['slug'].setValue(slug);
    }
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
    //Load data to form
    var categories = this.postCategoryApiClient.getPostCategories();
    var tags = this.postApiClient.getAllTags();
    this.toggleBlockUI(true);
    forkJoin({
      categories,
      tags,
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (repsonse: any) => {
          //Push categories to dropdown list
          this.tags = repsonse.tags as string[];

          var categories = repsonse.categories as PostCategoryDto[];
          categories.forEach((element) => {
            this.postCategories.push({
              value: element.id,
              label: element.name,
            });
          });
          if (this.utilService.isEmpty(this.config.data?.id) == false) {
            this.postApiClient
              .getPostTags(this.config.data.id)
              .subscribe((res:any) => {
                this.postTags = res;
                this.loadFormDetails(this.config.data?.id);
              });

            
          } else {
            this.toggleBlockUI(false);
          }
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
  }
  loadFormDetails(id: string) {
    this.postApiClient
      .getPostById(id)
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
      this.uploadService.uploadImage('posts', event.target.files).subscribe({
        next: (response: any) => {
          this.form.controls['thumbnail'].setValue(response.path);
          this.thumbnailImage = environment.API_URL + response.path;
        },
        error: (err: any) => {
          console.log(err);
        },
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
      this.postApiClient
        .createPost(this.form.value)
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
      this.postApiClient
        .updatePost(this.config.data?.id, this.form.value)
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
      slug: new FormControl(
        this.selectedEntity.slug || null,
        Validators.required
      ),
      categoryId: new FormControl(
        this.selectedEntity.categoryId || null,
        Validators.required
      ),
      description: new FormControl(
        this.selectedEntity.description || null,
        Validators.required
      ),
      seoDescription: new FormControl(
        this.selectedEntity.seoDescription || null
      ),
      content: new FormControl(this.selectedEntity.content || null),
      thumbnail: new FormControl(this.selectedEntity.thumbnail || null),
      tags: new FormControl(this.postTags),
    });
    if (this.selectedEntity.thumbnail) {
      this.thumbnailImage = environment.API_URL + this.selectedEntity.thumbnail;
    }
  }

  filterTag(event: AutoCompleteCompleteEvent) {
    let filtered: string[] = [];
    let query = event.query;

    for (let i = 0; i < (this.tags as string[]).length; i++) {
      let tag = (this.tags as string[])[i];
      if (tag.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(tag);
      }
    }
    if (filtered.length == 0) {
      filtered.push(query);
    }
    this.filteredTags = filtered;
  }
}
