import { HttpClient} from '@angular/common/http';
import { computed, inject, Injectable, InjectionToken, signal } from '@angular/core';
import { loginModel } from '../Models/login.model'
import { map, Observable } from 'rxjs';
import { AuthenticatedResult } from '../../../Shared/Model/token.model';
import { RegisterModel } from '../Models/Register.model';
export const ADMIN_API_BASE_URL = new InjectionToken<string>('ADMIN_API_BASE_URL');

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl  = inject(ADMIN_API_BASE_URL);
  currentUser = signal<any | null>(null);
  nameUser = computed(() => {
    return this.currentUser()?.fullName;
  });

  login(body: loginModel):Observable<AuthenticatedResult> {
    let url_ = this.baseUrl + "/api/admin/auth";
    url_ = url_.replace(/[?&]$/, "");
    return this.http.post<AuthenticatedResult>(url_, body).pipe(
      map((res:any)=> {
        this.currentUser.set(res);
        return res;
      })
    )
    
  }

  register(body: RegisterModel):Observable<AuthenticatedResult> {
    let url_ = this.baseUrl + "/api/admin/auth/register"; 
    url_ = url_.replace(/[?&]$/, "");
   
    return this.http.post<AuthenticatedResult>(url_, body)
    
  }

  getProfile(){
    let url_ = this.baseUrl + "/profile";
    return this.http.get(url_).pipe(
      map((user:any) => {
        console.log(user)
        this.currentUser.set(user);
        return user;
      })
    )
  }
 
}
