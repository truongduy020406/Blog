import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ADMIN_API_BASE_URL } from '../../Auth/Service/auth.service';
import { changePassword } from '../Models/changePW.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);
  private baseUrl = inject(ADMIN_API_BASE_URL);


  headers = new HttpHeaders({
    'Content-Type': 'application/json',  
  });
  getProfile() {
    let url_ = this.baseUrl + '/profile';
    return this.http.get(url_);
  }
  

  changePassword(data:changePassword){
    let url_ = this.baseUrl + '/profile/change-password';
    return this.http.put(url_,data, {
      headers: this.headers,
      responseType: 'text'  // Chỉ định response type là text
    });
  }
}
