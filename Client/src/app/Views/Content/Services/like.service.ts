import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ADMIN_API_BASE_URL } from '../../Auth/Service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private http = inject(HttpClient);
  private baseUrl = inject(ADMIN_API_BASE_URL);

  LikePost(postId: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.baseUrl}/api/Like`;
  
    const likeDTO = {
      postId: postId, 
    };
  
    return this.http.post<void>(url, likeDTO, { headers });
  }
  
  deletePost(postId: string) {
    let url_ = this.baseUrl + `/api/Like?postId=${postId}`;
    return this.http.delete<void>(url_, );
  }
  countLike(postId: string) {
    let url_ = this.baseUrl + `/api/Like/count/post/${postId}`;
    return this.http.get<any>(url_);
  }

  //status/post/

  getStatusLikePosst(postId: string) {
    let url_ = this.baseUrl + `/api/Like/status/post/${postId}`;
    return this.http.get<any>(url_);
  }
}
