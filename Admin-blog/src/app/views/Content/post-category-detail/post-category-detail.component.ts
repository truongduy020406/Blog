import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { PostCategoryDto } from '../Model/PostCategoryDto.model';
import { UtilityService } from '../../../Shared/Service/utility.service'
import { PostCategoryService } from '../Services/post-category.service';
import { PanelModule } from 'primeng/panel';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ValidationMessageComponent } from '../../../Shared/modules/validation-message/validation-message.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
@Component({
  selector: 'app-post-category-detail',
  standalone: true,
    imports: [BlockUIModule,
      ProgressSpinnerModule,
      ValidationMessageComponent,
      KeyFilterModule,
      ReactiveFormsModule,
      PanelModule,
      CheckboxModule,
      InputNumberModule 
    ],
  templateUrl: './post-category-detail.component.html',
  styleUrl: './post-category-detail.component.scss'
})
export class PostCategoryDetailComponent {
  private ngUnsubscribe = new Subject<void>();

  // Default
  blockedPanelDetail: boolean = false;
  form!: FormGroup;
  title: string = '';
  btnDisabled = false;
  saveBtnName: string = '';
  closeBtnName: string = '';
  selectedEntity = {} as PostCategoryDto;

  formSavedEventEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
      public ref: DynamicDialogRef,
      public config: DynamicDialogConfig,
      private utilService: UtilityService,
      private fb: FormBuilder,
      private postCategoryService:PostCategoryService
    ) {
  }

  ngOnDestroy(): void {
      if (this.ref) {
          this.ref.close();
      }
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
  }

  public generateSlug() {
      var slug = this.utilService.makeSeoTitle(this.form.get('name')?.value);
      this.form.controls['slug'].setValue(slug)
  }

  ngOnInit() {
      this.buildForm();
      if (this.utilService.isEmpty(this.config.data?.id) == false) {
          this.loadDetail(this.config.data.id);
          this.saveBtnName = 'Cập nhật';
          this.closeBtnName = 'Hủy';
      } else {
          this.saveBtnName = 'Thêm';
          this.closeBtnName = 'Đóng';
      }
  }

  // Validate
  noSpecial: RegExp = /^[^<>*!_~]+$/
  validationMessages = {
      'name': [
          { type: 'required', message: 'Bạn phải nhập tên' },
          { type: 'minlength', message: 'Bạn phải nhập ít nhất 3 kí tự' },
          { type: 'maxlength', message: 'Bạn không được nhập quá 255 kí tự' }
      ],
      'slug': [
          { type: 'required', message: 'Bạn phải nhập mã duy nhất' }
      ],
      'sortOrder': [
          { type: 'required', message: 'Bạn phải nhập thứ tự' }
      ]
  }

  loadDetail(id: any) {
      this.toggleBlockUI(true);
      this.postCategoryService.getPostCategoryById(id)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe({
              next: (response: PostCategoryDto) => {
                  this.selectedEntity = response;
                  this.buildForm();
                  this.toggleBlockUI(false);

              }
              , error: () => {
                  this.toggleBlockUI(false);
              }
          });
  }
  saveChange() {
      this.toggleBlockUI(true);

      this.saveData();
  }

  private saveData() {
      if (this.utilService.isEmpty(this.config.data?.id)) {
          this.postCategoryService.createPostCategory(this.form.value)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(() => {
                  this.ref.close(this.form.value);
                  this.toggleBlockUI(false);

              });
      }
      else {
          this.postCategoryService.updatePostCategory(this.config.data.id, this.form.value)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(() => {
                  this.toggleBlockUI(false);
                  this.ref.close(this.form.value);
              });
      }
  }

  buildForm() {
      this.form = this.fb.group({
          name: new FormControl(this.selectedEntity.name || null, Validators.compose([
              Validators.required,
              Validators.maxLength(255),
              Validators.minLength(3)
          ])),
          slug: new FormControl(this.selectedEntity.slug || null, Validators.required),
          sortOrder: new FormControl(this.selectedEntity.sortOrder || 0, Validators.required),
          isActive: new FormControl(this.selectedEntity.isActive || true),
          seoDescription: new FormControl(this.selectedEntity.seoDescription || null),
      });
  }


  private toggleBlockUI(enabled: boolean) {
      if (enabled == true) {
          this.btnDisabled = true;
          this.blockedPanelDetail = true;
      }
      else {
          setTimeout(() => {
              this.btnDisabled = false;
              this.blockedPanelDetail = false;
          }, 1000);
      }

  }
}
