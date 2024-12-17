import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { PostService } from '../Services/post.service';
import { PanelModule } from 'primeng/panel';
import { ValidationMessageComponent} from '../../../../Shared/modules/validation-message/validation-message.component';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: 'app-post-return-reason',
  standalone: true,
  imports: [
    PanelModule,
    ValidationMessageComponent,
    BlockUIModule,
    ProgressSpinnerModule,
    ReactiveFormsModule
  ],
  templateUrl: './post-return-reason.component.html',
  styleUrl: './post-return-reason.component.scss'
})
export class PostReturnReasonComponent {
  private ngUnsubscribe = new Subject<void>();

    // Default
    blockedPanelDetail: boolean = false;
    form!: FormGroup;
    title: string = '';
    btnDisabled = false;
    saveBtnName: string = '';
    contentTypes: any[] = [];

    formSavedEventEmitter: EventEmitter<any> = new EventEmitter();

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private fb: FormBuilder,
        private postApiClient: PostService,
    ) { }

    ngOnDestroy(): void {
        if (this.ref) {
            this.ref.close();
        }
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    validationMessages = {
        reason: [{ type: 'required', message: 'Bạn phải nhập lý do' }],
    };

    ngOnInit() {
        //Init form
        this.buildForm();
    }

    saveChange() {
        this.toggleBlockUI(true);
        this.saveData();
    }

    private saveData() {
        this.toggleBlockUI(true);
        this.postApiClient
            .returnBack(this.config.data.id, this.form.value)
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
            reason: new FormControl(null, Validators.required)
        });

    }
}
