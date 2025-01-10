import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ADMIN_API_BASE_URL } from '../../Auth/Service/auth.service';
import { CreateUpdateCommentDto } from '../Model/CreateComment.model';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private http = inject(HttpClient);
  private baseUrl  = inject(ADMIN_API_BASE_URL);

  createComment(body?: CreateUpdateCommentDto | undefined): Observable<void> {
      console.log(body);
      let url_ = this.baseUrl + "/api/Comment";
      url_ = url_.replace(/[?&]$/, "");
      
      return this.http.post<void>(url_, body, { responseType: 'text' as 'json' })
        .pipe(
          catchError(error => {
            console.error('Error creating post', error);
            throw error; // Handle error as needed
          })
        );
    }
}
