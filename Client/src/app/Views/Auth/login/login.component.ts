import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { AuthService } from '../Service/auth.service'
import { loginModel } from '../Models/login.model';
import { ValidationMessageComponent } from '../../../Shared/modules/validation-message/validation-message.component';
import { TokenStorageService } from '../../../Shared/Service/token.service';
@Component({
  selector: 'app-login',
  standalone: true, // 
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule , 
    CommonModule,
    ValidationMessageComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading: boolean = false;
  error: string = '';
  data:loginModel | undefined ;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService:AuthService , 
    private messageService: MessageService,
    private tokenService:TokenStorageService
  ) {}

  validationMessages = {
    'username': [
        { type: 'required', message: 'Bạn phải nhập tên' },
        { type: 'minlength', message: 'Bạn phải nhập ít nhất 6 kí tự' },
        { type: 'maxlength', message: 'Bạn không được nhập quá 15 kí tự' }
    ],
    'password': [
        { type: 'required', message: 'Bạn phải nhập mật khẩu' }
    ]
}
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(15)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    this.data  = {
      username : this.loginForm.value.username,
      password : this.loginForm.value.password
    }
    this.loading = true;
    this.authService.login(this.data).subscribe({
      next:(res) => {
        console.log(res)
        this.tokenService.saveToken(res.token);
        this.tokenService.saveRefreshToken(res.refreshToken);
        this.tokenService.saveUser(res);
        this.loading = false
        this.router.navigate(['/'])
      },
      error:(e) => {
         this.messageService.add({severity: 'error', summary: 'Validation Failed', detail: 'Please fill in all fields.'});
         this.loading = false
      }
    }
      
    )
   
  }
}
