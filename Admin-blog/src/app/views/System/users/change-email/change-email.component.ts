import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../Service/user.service';
import { UserDto } from '../Models/UserDto.model';
import { PanelModule } from 'primeng/panel';
import { BlockUIModule } from 'primeng/blockui';
import { ValidationMessageComponent} from '../../../../Shared/modules/validation-message/validation-message.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { KeyFilterModule } from 'primeng/keyfilter';
@Component({
  selector: 'app-change-email',
  standalone: true,
  imports: [PanelModule,
    BlockUIModule,
    ValidationMessageComponent,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    KeyFilterModule
  ],
  templateUrl: './change-email.component.html',
  styleUrl: './change-email.component.scss'
})
export class ChangeEmailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  // Default
   blockedPanelDetail: boolean = false;
   form!: FormGroup;
   title!: string;
   btnDisabled = false;
   saveBtnName!: string;
   closeBtnName!: string;
   email: string = '';
  formSavedEventEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.buildForm();
    this.loadDetail(this.config.data.id);
    this.saveBtnName = 'Cập nhật';
    this.closeBtnName = 'Hủy';
  }

  // Validate
  noSpecial: RegExp = /^[^<>*!_~]+$/;
  validationMessages = {
    email: [
      { type: 'required', message: 'Bạn phải nhập email' },
      { type: 'email', message: 'Email không đúng định dạng' },
    ],
  };

  loadDetail(id: any) {
    this.toggleBlockUI(true);
    this.userService
      .getUserById(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: UserDto) => {
          this.email = response.email;
          this.buildForm();
          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
  }
  saveChange() {
    this.toggleBlockUI(true);
    console.log(this.form.value)
    this.saveData();
  }

  private saveData() {
    this.userService
      .changeEmail(this.config.data.id, this.form.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.toggleBlockUI(false);
        this.ref.close(this.form.value);
      });
  }

  buildForm() {
    this.form = this.fb.group({
      email: new FormControl(
        this.email || null,
        Validators.compose([Validators.required, Validators.email])
      ),
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
