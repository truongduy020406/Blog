import { inject, Injectable } from '@angular/core';
import { ADMIN_API_BASE_URL } from '../../Auth/Service/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { questionDTO } from '../Models/question.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private http = inject(HttpClient);
  private baseUrl = inject(ADMIN_API_BASE_URL);

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  constructor() {}

  getQuestionById(id: string): Observable<questionDTO> {
    let url_ = this.baseUrl + '/api/question/{id}';
    if (id === undefined || id === null)
      throw new Error("The parameter 'id' must be defined.");
    url_ = url_.replace('{id}', encodeURIComponent('' + id));
    url_ = url_.replace(/[?&]$/, '');
    return this.http.get<questionDTO>(url_);
  }
  getLastQuestion():Observable<questionDTO[]>{
    let url_ = this.baseUrl + '/api/Question/Latestquestion';
    return this.http.get<questionDTO[]>(url_);
  }
  getQuestionPaging(
    keyword?: string | null | undefined,
    pageIndex?: number | undefined,
    pageSize?: number | undefined
  ) {
    let url_ = this.baseUrl + '/api/Question/paging?';
    if (keyword !== undefined && keyword !== null)
      url_ += 'keyword=' + encodeURIComponent('' + keyword) + '&';
    if (pageIndex === null)
      throw new Error("The parameter 'pageIndex' cannot be null.");
    else if (pageIndex !== undefined)
      url_ += 'pageIndex=' + encodeURIComponent('' + pageIndex) + '&';
    if (pageSize === null)
      throw new Error("The parameter 'pageSize' cannot be null.");
    else if (pageSize !== undefined)
      url_ += 'pageSize=' + encodeURIComponent('' + pageSize) + '&';
    url_ = url_.replace(/[?&]$/, '');

    return this.http.get(url_);
  }
  // 

  getQuestionByUserPaging(
    keyword?: string | null | undefined,
    pageIndex?: number | undefined,
    pageSize?: number | undefined
  ) {
    let url_ = this.baseUrl + '/api/Question/user/question?';
    if (keyword !== undefined && keyword !== null)
      url_ += 'keyword=' + encodeURIComponent('' + keyword) + '&';
    if (pageIndex === null)
      throw new Error("The parameter 'pageIndex' cannot be null.");
    else if (pageIndex !== undefined)
      url_ += 'pageIndex=' + encodeURIComponent('' + pageIndex) + '&';
    if (pageSize === null)
      throw new Error("The parameter 'pageSize' cannot be null.");
    else if (pageSize !== undefined)
      url_ += 'pageSize=' + encodeURIComponent('' + pageSize) + '&';
    url_ = url_.replace(/[?&]$/, '');

    return this.http.get(url_);
  }

  addQuestion(body: questionDTO) {
    let url_ = this.baseUrl + '/profile/question/create';
    return this.http.post(url_, body);
  }

  updateSeries(body: questionDTO, data: any) {
    let url_ = this.baseUrl + '/profile/question/create';
    return this.http.post(url_, body);
  }

  deleteSeries(ids: any) {
    let url_ = this.baseUrl + '/api/admin/series?';
    if (ids !== undefined && ids !== null)
      ids &&
        ids.forEach((item: any) => {
          url_ += 'ids=' + encodeURIComponent('' + item) + '&';
        });
    url_ = url_.replace(/[?&]$/, '');

    let options_: any = {
      observe: 'response',
      responseType: 'blob',
      headers: new HttpHeaders({}),
    };

    return this.http.delete(url_, options_);
  }
}
