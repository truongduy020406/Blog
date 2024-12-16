import { Component, OnDestroy } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../shared/service/alert.service';
import { AuthService } from '../Service/auth.service'
import { Router } from '@angular/router';
import { loginModel } from '../Model/login.model';
import {ReactiveFormsModule} from '@angular/forms';
import { UrlConstants } from '../../../shared/constants/Url.onstants'
import { TokenStorageService } from '../../../shared/service/token.service';
import { AuthenticatedResult } from '../../../shared/Model/token.model'
import { Subject, takeUntil } from 'rxjs';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, 
      TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, 
      InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle,ReactiveFormsModule,CommonModule]
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  private ngUnsubscribe = new Subject<void>();
  loading = false;
  
  constructor(private fb:FormBuilder,
    private alerService:AlertService,
    private authApiClient: AuthService,
    private router:Router,
    private tokenService:TokenStorageService
  ) { 
    this.loginForm = this.fb.group({
      username: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required)
    }
    )
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  login(){
    var required:loginModel = {
      username:this.loginForm.value.username,
      password:this.loginForm.value.password
    }
    this.authApiClient.login(required)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
        next:((res:AuthenticatedResult) => {
          this.tokenService.saveToken(res.token);
          this.tokenService.saveRefreshToken(res.refreshToken);
          this.tokenService.saveUser(res);
          this.router.navigate([UrlConstants.HOME]);
        }),
        error:(error:any)=> {
          this.alerService.showError('login invalid')
          this.loading = false;
        }
      }
    )
  }

}
