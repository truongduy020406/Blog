import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { loginModel } from '../Model/login.model'
import { Observable } from 'rxjs';
import { AuthenticatedResult } from '../../../shared/Model/token.model';
export const ADMIN_API_BASE_URL = new InjectionToken<string>('ADMIN_API_BASE_URL');

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl  = inject(ADMIN_API_BASE_URL);
  constructor() { }

  login(body: loginModel):Observable<AuthenticatedResult> {
    let url_ = this.baseUrl + "/api/admin/auth";
    url_ = url_.replace(/[?&]$/, "");
   
    console.log(body)
    return this.http.post<AuthenticatedResult>(url_, body)
    
  }
  test(){
    let url_ = this.baseUrl + "/api/Test";
    return this.http.get(url_)
  }
}
