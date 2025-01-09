import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ADMIN_API_BASE_URL } from '../../Auth/Service/auth.service';
import { catchError, Observable } from 'rxjs';
import { PostActivityLogDto } from '../Model/PostActivityLogDto.model';
import { CreateUpdatePostRequest } from '../Model/CreateUpdatePostRequest.model';
import { ReturnBackRequest } from '../Model/ReturnBackRequest.model';
import { PostInListDtoPagedResult } from '../Model/PostInListDtoPagedResult.model';
import { SeriesInListDto } from '../Model/SeriesInListDto.model';
import { PostInListDto } from '../Model/PostInListDto.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private http = inject(HttpClient);
  private baseUrl  = inject(ADMIN_API_BASE_URL);
  protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

  headers = new HttpHeaders({
    'Content-Type': 'application/json',  
  });
  getActivityLogs(id: string): Observable<PostActivityLogDto[]> {
    let url_ = this.baseUrl + "/api/admin/post/activity-logs/{id}";
    if (id === undefined || id === null)
        throw new Error("The parameter 'id' must be defined.");
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");
    return this.http.get<PostActivityLogDto[]>( url_)
  }

  getPostById(id: string):Observable<any> {
    let url_ = this.baseUrl + `/api/admin/post/${id}`;

    return this.http.get<any>(url_)
  } 

  createPost(body?: CreateUpdatePostRequest | undefined): Observable<void> {
    console.log(body);
    let url_ = this.baseUrl + "/profile/posts/create";
    url_ = url_.replace(/[?&]$/, "");
    
    // Make the request with a response type of 'text' if the backend returns plain text
    return this.http.post<void>(url_, body, { responseType: 'text' as 'json' })
      .pipe(
        catchError(error => {
          console.error('Error creating post', error);
          throw error; // Handle error as needed
        })
      );
  }
  

  updatePost(id?: string | undefined, body?: CreateUpdatePostRequest | undefined): Observable<void> {
    let url_ = this.baseUrl + "/api/admin/post?";
    if (id === null)
        throw new Error("The parameter 'id' cannot be null.");
    else if (id !== undefined)
        url_ += "id=" + encodeURIComponent("" + id) + "&";
    url_ = url_.replace(/[?&]$/, "");

    return this.http.put<void>( url_, body)
  }

  deletePosts(ids?: string[] | null | undefined){
    let url_ = this.baseUrl + "/api/admin/post?";
    if (ids !== undefined && ids !== null)
        ids && ids.forEach(item => { url_ += "ids=" + encodeURIComponent("" + item) + "&"; });
    url_ = url_.replace(/[?&]$/, "");

    let options_ : any = {
        observe: "response",
        responseType: "blob",
        headers: new HttpHeaders({
        })
    };

    return this.http.delete( url_, options_)
  }

  returnBack(id: string, body?: ReturnBackRequest | undefined): Observable<void> {
    let url_ = this.baseUrl + "/api/admin/post/return-back/{id}";
    if (id === undefined || id === null)
        throw new Error("The parameter 'id' must be defined.");
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");


    return this.http.post<void>( url_, body)
  }

  getSeriesBelong(postId: string): Observable<SeriesInListDto[]> {
    let url_ = this.baseUrl + "/api/admin/post/series-belong/{postId}";
    if (postId === undefined || postId === null)
        throw new Error("The parameter 'postId' must be defined.");
    url_ = url_.replace("{postId}", encodeURIComponent("" + postId));
    url_ = url_.replace(/[?&]$/, "");
    return this.http.get<SeriesInListDto[]>( url_)
  }


  getPostsUserPaging(keyword?: string | null | undefined, categoryId?: string | null | undefined, 
    pageIndex?: number | undefined, pageSize?: number | undefined): Observable<PostInListDtoPagedResult> {
    let url_ = this.baseUrl + "/profile/posts/list?";
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

  approvePost(id: string){
    let url_ = this.baseUrl + "/api/admin/post/approve/{id}";
    if (id === undefined || id === null)
        throw new Error("The parameter 'id' must be defined.");
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");

    let options_ : any = {
        observe: "response",
        responseType: "blob",
        headers: new HttpHeaders({
        })
    };

    return this.http.get( url_, options_)
  }

  sendToApprove(id: string) {
    let url_ = this.baseUrl + "/api/admin/post/approval-submit/{id}";
    if (id === undefined || id === null)
        throw new Error("The parameter 'id' must be defined.");
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");


    return this.http.get(url_)
  }

  getPostTags(postId: string) :Observable<string[]>{
    let url_ = this.baseUrl + "/api/admin/post/tags/{postId}";
    if (postId === undefined || postId === null)
        throw new Error("The parameter 'postId' must be defined.");
    url_ = url_.replace("{postId}", encodeURIComponent("" + postId));
    url_ = url_.replace(/[?&]$/, "");

    return this.http.get<string[]>(url_)
  }

  getAllTags() {
    let url_ = this.baseUrl + "/api/admin/post/tags";
    return this.http.get( url_)
  }

  getPostsByTag(tag: string, page: number): Observable<any> {
    let url_ = this.baseUrl + "/api/PostsClient/tag";
    const params = new HttpParams()
      .set('page', page.toString()); 

    return this.http.get<any>(`${url_}/${tag}`, { params });
  }

  getPopularProfiles(): Observable<PostInListDto[]> {
    return this.http.get<PostInListDto[]>(`${this.baseUrl}/api/Profile/popular`);
  }

  getPostAndIncreaseView(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/admin/post/postview/${id}`);
  }
}
