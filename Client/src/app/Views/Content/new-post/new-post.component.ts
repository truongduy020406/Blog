import { Component, EventEmitter, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { ValidationMessageComponent } from '../../../Shared/modules/validation-message/validation-message.component';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { UtilityService } from '../../../Shared/Service/utility.service';
import { PostService } from '../Services/post.service';
import { UploadService } from '../../../Shared/Service/upload.service';
import { PostCategoryService } from '../Services/post-category.service';
import { PostCategoryDto } from '../Model/PostCategoryDto.model';
import { environment } from '../../../../environments/environment';
import { PostDto } from '../Model/PostDto.model';
import { ButtonModule } from 'primeng/button';
import { MessageConstants } from '../../../Shared/constants/Message.constants';
import { AlertService } from '../../../Shared/Service/alert.service';
@Component({
  selector: 'app-new-post',
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
    AutoCompleteModule,
    ButtonModule,
  ],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss',
})
export class NewPostComponent implements OnInit {
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
  selectedCategory: any;
  thumbnailImage: any;
  tags: string[] | undefined;
  filteredTags: any;
  postTags: string[] = [];
  formSavedEventEmitter: EventEmitter<any> = new EventEmitter();
  constructor(
    private utilService: UtilityService,
    private fb: FormBuilder,
    private postApiClient: PostService,
    private postCategoryApiClient: PostCategoryService,
    private uploadService: UploadService,
    private alertService: AlertService
  ) {
  }
  ngOnDestroy(): void {
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
    this.toggleBlockUI(false);
    forkJoin({
      categories,
      tags,
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (repsonse: any) => {
          //Push categories to dropdown list
          this.tags = repsonse.tags as string[];

          const categories = repsonse.categories as PostCategoryDto[];
          this.postCategories = categories.map((element) => ({
            code: element.id, // Assuming `id` is the correct key for code
            name: element.name // Assuming `name` is the correct key for name
          }));

          console.log(this.postCategories);
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      this.uploadService.uploadImage('posts', event.target.files).subscribe({
        next: (response: any) => {
          this.form.controls['thumbnail'].setValue(response.path);
          this.thumbnailImage = environment.API_URL + response.path;
          console.log(this.thumbnailImage);
          console.log(response);
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
    this.postApiClient
      .createPost(this.form.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.toggleBlockUI(false);
          this.alertService.showSuccess(MessageConstants.CREATED_OK_MSG);
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
