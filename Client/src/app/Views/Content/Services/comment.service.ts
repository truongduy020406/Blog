import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ADMIN_API_BASE_URL } from '../../Auth/Service/auth.service';
import { CreateUpdateCommentDto } from '../Model/CreateComment.model';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private http = inject(HttpClient);
  private baseUrl = inject(ADMIN_API_BASE_URL);

  createComment(body?: CreateUpdateCommentDto | undefined): Observable<void> {
    let url_ = this.baseUrl + '/api/Comment';
    url_ = url_.replace(/[?&]$/, '');
    console.log(body);
    return this.http
      .post<void>(url_, body, { responseType: 'text' as 'json' })
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }

  updateComment(id: string, body: CreateUpdateCommentDto) {
    const url = `${this.baseUrl}/api/Comment/${id}`;
    console.log('Sending body:', body);

    return this.http.put(url, body, {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'text', // Thêm dòng này nếu phản hồi là chuỗi văn bản
    });
  }

  getComment(id: string) {
    let url_ = this.baseUrl + `/api/Comment/post/${id}`;
    return this.http.get<any>(url_);
  }

  DeleteComment(id: string | undefined) {
    const url = `${this.baseUrl}/api/Comment/${id}`; // Sử dụng DELETE thay vì POST
    return this.http.delete<any>(url);
}


  getCommentWithId(id: string) {
    let url_ = this.baseUrl + `/api/Comment/${id}`;
    return this.http.get<any>(url_);
  }
}
