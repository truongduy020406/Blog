import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { loginModel } from '../Models/login.model';
import { Router } from '@angular/router';
import { AuthService } from '../Service/auth.service';
import { MessageService } from 'primeng/api';
import { TokenStorageService } from '../../../Shared/Service/token.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ValidationMessageComponent } from '../../../Shared/modules/validation-message/validation-message.component';
import { RegisterModel } from '../Models/Register.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    CommonModule,
    ValidationMessageComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  loginForm!: FormGroup;
  loading: boolean = false;
  error: string = '';
  data: RegisterModel | undefined;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService,
    private tokenService: TokenStorageService
  ) {}

  validationMessages = {
    firstName: [
      { type: 'required', message: 'Bạn phải nhập tên' },
      { type: 'minlength', message: 'Bạn phải nhập ít nhất 6 kí tự' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 15 kí tự' },
    ],
    lastName: [
      { type: 'required', message: 'Bạn phải nhập tên' },
      { type: 'minlength', message: 'Bạn phải nhập ít nhất 6 kí tự' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 15 kí tự' },
    ],
    password: [{ type: 'required', message: 'Bạn phải nhập mật khẩu' }],
    email: [
      { type: 'email', message: 'Bạn phải nhập đúng email' },
      { type: 'required', message: 'Bạn phải nhập email' },
    ],
  };
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(15),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(15),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    this.data = {
      firstName: this.loginForm.value.firstName,
      lastName: this.loginForm.value.lastName,
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.loading = true;
    this.authService.register(this.data).subscribe({
      next: (res) => {
      },
      error: (e) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Failed',
          detail: 'Please fill in all fields.',
        });
        this.loading = false;
      },
    });
  }
}
