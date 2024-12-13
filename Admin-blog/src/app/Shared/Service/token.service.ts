import { inject, Injectable } from '@angular/core';
import { UserModel } from '../Model/user.model';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { TokenRequest } from '../Model/TokenRequest.model';
import { AuthenticatedResult } from '../Model/token.model';
import { ADMIN_API_BASE_URL } from 'src/app/views/Auth/Service/auth.service';

const TOKEN_KEY = 'auth-token';
const REFRESHTOKEN_KEY = 'auth-refreshtoken';
const USER_KEY = 'auth-user';
@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  private baseUrl  = inject(ADMIN_API_BASE_URL);
  private http = inject(HttpClient);
  signOut(): void {
    localStorage.clear();
  }

  public saveToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);

    const user = this.getUser();
    if (user?.id) {
      this.saveUser({ ...user, accessToken: token });
    }
  }

  public getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  public saveRefreshToken(token: string): void {
    window.localStorage.removeItem(REFRESHTOKEN_KEY);
    window.localStorage.setItem(REFRESHTOKEN_KEY, token);
  }

  public getRefreshToken() {
    return window.localStorage.getItem(REFRESHTOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): UserModel | null {
    const token = window.localStorage.getItem(USER_KEY);
    if (!token)
      return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const user: UserModel = JSON.parse(this.b64DecodeUnicode(base64));
    return user;
  }

  b64DecodeUnicode(str:any) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }


  refresh(body?: TokenRequest | undefined): Observable<AuthenticatedResult> {
    let url_ = this.baseUrl + "/api/admin/token/refresh";
    url_ = url_.replace(/[?&]$/, "");
    return this.http.post<AuthenticatedResult>(url_, body)
  }
}