import { Component, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { PanelModule } from 'primeng/panel';
import { ValidationMessageComponent } from '../../../Shared/modules/validation-message/validation-message.component';
import { ImageModule } from 'primeng/image';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { EditorModule } from 'primeng/editor';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UtilityService } from '../../../Shared/Service/utility.service';
import { UploadService } from '../../../Shared/Service/upload.service';
import { Subject, takeUntil } from 'rxjs';
import { QuestionService } from '../Services/question.service';
import { environment } from '../../../../environments/environment';
import { questionDTO } from '../Models/question.model';

@Component({
  selector: 'app-question-detail',
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
    EditorModule,
  ],
  templateUrl: './question-detail.component.html',
  styleUrl: './question-detail.component.scss',
})
export class QuestionDetailComponent {
  private ngUnsubscribe = new Subject<void>();
  formSavedEventEmitter: EventEmitter<any> = new EventEmitter();
  selectedEntity = {} as questionDTO;
  blockedPanelDetail: boolean = false;
  form!: FormGroup;
  title: string = '';
  btnDisabled = false;
  thumbnailImage: any;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private utilService: UtilityService,
    private fb: FormBuilder,
    private questionService: QuestionService,
    private uploadService: UploadService
  ) {}

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  noSpecial: RegExp = /^[^<>*!_~]+$/;
  validationMessages = {
    title: [
      { type: 'required', message: 'Bạn phải nhập tên' },
      { type: 'minlength', message: 'Bạn phải nhập ít nhất 3 kí tự' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 255 kí tự' },
    ],
    content: [{ type: 'required', message: 'Bạn phải nhập mô tả ngắn' }],
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
    this.questionService
      .getQuestionById(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: questionDTO) => {
          console.log(response)
          this.selectedEntity = response;
          this.buildForm();
          this.toggleBlockUI(false);
        },
        error: () => {
          console.log(1)
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
      this.questionService
        .addQuestion(this.form.value)
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
      this.questionService
        .updateQuestion(this.config.data?.id, this.form.value)
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
      title: new FormControl(
        this.selectedEntity.title || null,
        Validators.required
      ),
      content: new FormControl(this.selectedEntity.content || null),
    });
  }
}
