import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ADMIN_API_BASE_URL } from '../../../Auth/Service/auth.service';
import { Observable } from 'rxjs';
import { UpdateUserRequest } from '../Models/UpdateUserRequest.model';
import { UserDtoPagedResult } from '../Models/UserDtoPagedResult.model';
import { ChangeEmailRequest } from '../Models/ChangeEmailRequest.model';
import { SetPasswordRequest } from '../Models/SetPasswordRequest.model';
import { ChangeMyPasswordRequest } from '../Models/ChangeMyPasswordRequest.model';
import { CreateUserRequest } from '../Models/CreateUserRequest.model';
import { UserDto } from '../Models/UserDto.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = inject(ADMIN_API_BASE_URL);
  protected jsonParseReviver: ((key: string, value: any) => any) | undefined =
    undefined;


    getUserById(id: string): Observable<UserDto> {
      let url_ = this.baseUrl + "/api/admin/user/{id}";
      if (id === undefined || id === null)
          throw new Error("The parameter 'id' must be defined.");
      url_ = url_.replace("{id}", encodeURIComponent("" + id));
      url_ = url_.replace(/[?&]$/, "");

     console.log(url_)

      return this.http.get<UserDto>(url_)
  }
  
  updateUser(id: string, body?: UpdateUserRequest | undefined) {
    let url_ = this.baseUrl + `/api/admin/user/${id}`;

    console.log(body)
    console.log(id)


    return this.http.put(url_, body);
  }

  getAllUsersPaging(keyword?: string | null | undefined, pageIndex?: number | undefined, pageSize?: number | undefined): Observable<UserDtoPagedResult> {
    let url_ = this.baseUrl + "/api/admin/user/paging?";
    if (keyword !== undefined && keyword !== null)
        url_ += "keyword=" + encodeURIComponent("" + keyword) + "&";
    if (pageIndex === null)
        throw new Error("The parameter 'pageIndex' cannot be null.");
    else if (pageIndex !== undefined)
        url_ += "pageIndex=" + encodeURIComponent("" + pageIndex) + "&";
    if (pageSize === null)
        throw new Error("The parameter 'pageSize' cannot be null.");
    else if (pageSize !== undefined)
        url_ += "pageSize=" + encodeURIComponent("" + pageSize) + "&";
    url_ = url_.replace(/[?&]$/, "");

    return this.http.get<UserDtoPagedResult>( url_)
}



createUser(body?: CreateUserRequest | undefined): Observable<void> {
  let url_ = this.baseUrl + "/api/admin/user";
  url_ = url_.replace(/[?&]$/, "");
  return this.http.post<void>(url_, body)
}

  deleteUsers(ids?: string[] | null | undefined) {
    let url_ = this.baseUrl + '/api/admin/user?';
    if (ids !== undefined && ids !== null)
      ids &&
        ids.forEach((item) => {
          url_ += 'ids=' + encodeURIComponent('' + item) + '&';
        });
    url_ = url_.replace(/[?&]$/, '');


    return this.http.delete(url_);
  }

  changeMyPassWord(body?: ChangeMyPasswordRequest | undefined) {
    let url_ = this.baseUrl + '/api/admin/user/password-change-current-user';
    url_ = url_.replace(/[?&]$/, '');

    return this.http.put(url_, body);
  }

  setPassword(id: string, body?: SetPasswordRequest | undefined) {
    let url_ = this.baseUrl + '/api/admin/user/set-password/{id}';
    if (id === undefined || id === null)
      throw new Error("The parameter 'id' must be defined.");
    url_ = url_.replace('{id}', encodeURIComponent('' + id));
    url_ = url_.replace(/[?&]$/, '');

    return this.http.post(url_, body);
  }

  changeEmail(id: string, body?: ChangeEmailRequest | undefined) {
    let url_ = this.baseUrl + '/api/admin/user/change-email/{id}';
    if (id === undefined || id === null)
      throw new Error("The parameter 'id' must be defined.");
    url_ = url_.replace('{id}', encodeURIComponent('' + id));
    url_ = url_.replace(/[?&]$/, '');
    return this.http.post(url_, body);
  }

  assignRolesToUser(id: string | null, body?: string[] | undefined) {
    let url_ = this.baseUrl + '/api/admin/user/{id}/assign-users';
    if (id === undefined || id === null)
      throw new Error("The parameter 'id' must be defined.");
    url_ = url_.replace('{id}', encodeURIComponent('' + id));
    url_ = url_.replace(/[?&]$/, '');
    return this.http.put(url_, body);
  }
}
