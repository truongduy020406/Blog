import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ADMIN_API_BASE_URL } from '../../Auth/Service/auth.service';
import { Observable } from 'rxjs';
import { PostInListDtoPagedResult } from '../Models/PostInListDtoPagedResult.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private http = inject(HttpClient);
  private baseUrl  = inject(ADMIN_API_BASE_URL);


  getPostById(id: string) {
    let url_ = this.baseUrl + `/api/admin/post/${id}`;

    return this.http.get(url_)
  } 
  
  getPostsPaging(keyword?: string | null | undefined, categoryId?: string | null | undefined, 
    pageIndex?: number | undefined, pageSize?: number | undefined): Observable<PostInListDtoPagedResult> {
    let url_ = this.baseUrl + "/api/admin/post/paging?";
    if (keyword !== undefined && keyword !== null)
        url_ += "keyword=" + encodeURIComponent("" + keyword) + "&";
    if (categoryId !== undefined && categoryId !== null)
        url_ += "categoryId=" + encodeURIComponent("" + categoryId) + "&";
    if (pageIndex === null)
        throw new Error("The parameter 'pageIndex' cannot be null.");
    else if (pageIndex !== undefined)
        url_ += "pageIndex=" + encodeURIComponent("" + pageIndex) + "&";
    if (pageSize === null)
        throw new Error("The parameter 'pageSize' cannot be null.");
    else if (pageSize !== undefined)
        url_ += "pageSize=" + encodeURIComponent("" + pageSize) + "&";
    url_ = url_.replace(/[?&]$/, "");

    return this.http.get<PostInListDtoPagedResult>( url_)
  } 
}
