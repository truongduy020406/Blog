import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ADMIN_API_BASE_URL } from '../../Auth/Service/auth.service';
import { Observable } from 'rxjs';
import { SeriesInListDto } from '../series/Model/SeriesInListDto.model';
import { AddPostSeriesRequest } from '../series/Model/AddPostSeriesRequest.model';
import { SeriesDto } from '../series/Model/SeriesDto.model';
import { CreateUpdateSeriesRequest } from '../series/Model/CreateUpdateSeriesRequest.model'
import { PostInListDto } from '../posts/Model/PostInListDto.model';
import { SeriesInListDtoPagedResult } from '../series/Model/SeriesInListDtoPagedResult.model'
@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  private http = inject(HttpClient);
  private baseUrl  = inject(ADMIN_API_BASE_URL);
  protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

  getAllSeries(): Observable<SeriesInListDto[]> {
    let url_ = this.baseUrl + "/api/admin/series";
    url_ = url_.replace(/[?&]$/, "");

    return this.http.get<SeriesInListDto[]>( url_)
  }

  deletePostSeries(body?: AddPostSeriesRequest | undefined){
    let url_ = this.baseUrl + "/api/admin/series/post-series";
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify(body);

    let options_ : any = {
        body: content_,
        observe: "response",
        responseType: "blob",
        headers: new HttpHeaders({
            "Content-Type": "application/json",
        })
    };

    return this.http.delete( url_, options_)
  }

  addPostSeries(body?: AddPostSeriesRequest | undefined) {
    let url_ = this.baseUrl + "/api/admin/series/post-series";
    url_ = url_.replace(/[?&]$/, "");

    return this.http.put( url_, body)
  }

  getSeriesById(id: string): Observable<SeriesDto> {
    let url_ = this.baseUrl + "/api/admin/series/{id}";
    if (id === undefined || id === null)
        throw new Error("The parameter 'id' must be defined.");
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");



    return this.http.get<SeriesDto>(url_)
  } 

  createSeries(body?: CreateUpdateSeriesRequest | undefined) {
    let url_ = this.baseUrl + "/api/admin/series";
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify(body);

    let options_ : any = {
        body: content_,
        observe: "response",
        responseType: "blob",
        headers: new HttpHeaders({
            "Content-Type": "application/json",
        })
    };

    return this.http.post( url_, body)
  }

  updateSeries(id?: string | undefined, body?: CreateUpdateSeriesRequest | undefined) {
    let url_ = this.baseUrl + "/api/admin/series?";
    if (id === null)
        throw new Error("The parameter 'id' cannot be null.");
    else if (id !== undefined)
        url_ += "id=" + encodeURIComponent("" + id) + "&";
    url_ = url_.replace(/[?&]$/, "");

    return this.http.put( url_,body)
  }

  getPostsInSeries(seriesId: string): Observable<PostInListDto[]> {
    let url_ = this.baseUrl + "/api/admin/series/post-series/{seriesId}";
    if (seriesId === undefined || seriesId === null)
        throw new Error("The parameter 'seriesId' must be defined.");
    url_ = url_.replace("{seriesId}", encodeURIComponent("" + seriesId));
    url_ = url_.replace(/[?&]$/, "");
    return this.http.get<PostInListDto[]>( url_)
  }

  getSeriesPaging(keyword?: string | null | undefined, pageIndex?: number | undefined, 
    pageSize?: number | undefined): Observable<SeriesInListDtoPagedResult> {
    let url_ = this.baseUrl + "/api/admin/series/paging?";
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

    return this.http.get<SeriesInListDtoPagedResult>( url_);
  }

  getSeriesUserPaging(keyword?: string | null | undefined, pageIndex?: number | undefined, 
    pageSize?: number | undefined): Observable<SeriesInListDtoPagedResult> {
    let url_ = this.baseUrl + "/api/admin/series/byuser?";
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

    return this.http.get<SeriesInListDtoPagedResult>( url_);
  }

  deleteSeries(ids?: string[] | null | undefined){
    let url_ = this.baseUrl + "/api/admin/series?";
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
}
