import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import { ToastModule } from '@coreui/angular';
import { AlertService } from 'src/app/Shared/Service/alert.service';
import { AuthService } from '../authService/auth.service'
import { loginModel } from '../model/login.model';
import { Router } from '@angular/router';
@Component({
    standalone:true,
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [ContainerComponent, RowComponent, ColComponent, 
              CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent,
              FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, 
              FormControlDirective, ButtonDirective, NgStyle,ReactiveFormsModule,ToastModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  constructor(private fb:FormBuilder,
    private alerService:AlertService,
    private authApiClient: AuthService,
    private router:Router
  ) { 
    this.loginForm = this.fb.group({
      username: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required)
    }
    )
  }

  login(){
    var required:loginModel = {
      username:this.loginForm.value.username,
      password:this.loginForm.value.password
    }
    console.log(required)
    this.authApiClient.login(required).subscribe(
      {
        next:(res => {
          this.router.navigate(['/dashboard']);
        }),
        error:(error:any)=> {
          console.log("error",error)
          this.alerService.showError('login invalid')
        }
      }
    )
  }

}
