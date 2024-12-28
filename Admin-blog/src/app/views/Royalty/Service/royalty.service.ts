import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ADMIN_API_BASE_URL } from '../../Auth/Service/auth.service';
import { RoyaltyReportByMonthDto } from '../Models/RoyaltyReportByMonthDto.model';
import { Observable } from 'rxjs';
import { RoyaltyReportByUserDto } from '../Models/RoyaltyReportByUserDto.model';
import { TransactionDtoPagedResult } from '../Models/TransactionDtoPagedResult.model';

@Injectable({
  providedIn: 'root'
})
export class RoyaltyService {
  private http = inject(HttpClient);
  private baseUrl  = inject(ADMIN_API_BASE_URL);
  protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

  getRoyaltyReportByMonth(userId?: string | null | undefined, fromMonth?: number | undefined, 
    fromYear?: number | undefined, toMonth?: number | undefined, toYear?: number | undefined): Observable<RoyaltyReportByMonthDto[]> {
    let url_ = this.baseUrl + "/api/admin/royalty/Royalty-report-by-month?";
    if (userId !== undefined && userId !== null)
        url_ += "userId=" + encodeURIComponent("" + userId) + "&";
    if (fromMonth === null)
        throw new Error("The parameter 'fromMonth' cannot be null.");
    else if (fromMonth !== undefined)
        url_ += "fromMonth=" + encodeURIComponent("" + fromMonth) + "&";
    if (fromYear === null)
        throw new Error("The parameter 'fromYear' cannot be null.");
    else if (fromYear !== undefined)
        url_ += "fromYear=" + encodeURIComponent("" + fromYear) + "&";
    if (toMonth === null)
        throw new Error("The parameter 'toMonth' cannot be null.");
    else if (toMonth !== undefined)
        url_ += "toMonth=" + encodeURIComponent("" + toMonth) + "&";
    if (toYear === null)
        throw new Error("The parameter 'toYear' cannot be null.");
    else if (toYear !== undefined)
        url_ += "toYear=" + encodeURIComponent("" + toYear) + "&";
    url_ = url_.replace(/[?&]$/, "");

    return this.http.get<RoyaltyReportByMonthDto[]>( url_)
  }

  payRoyalty(userId: string): Observable<void> {
    let url_ = this.baseUrl + "/api/admin/royalty/{userId}";
    if (userId === undefined || userId === null)
        throw new Error("The parameter 'userId' must be defined.");
    url_ = url_.replace("{userId}", encodeURIComponent("" + userId));
    url_ = url_.replace(/[?&]$/, "");

    let options_ : any = {
        observe: "response",
        responseType: "blob",
        headers: new HttpHeaders({
        })
    };

    return this.http.post<void>( url_, options_)
  }

  getRoyaltyReportByUser(userId?: string | null | undefined, fromMonth?: number | undefined,
     fromYear?: number | undefined, toMonth?: number | undefined, toYear?: number | undefined): Observable<RoyaltyReportByUserDto[]> {
    let url_ = this.baseUrl + "/api/admin/royalty/Royalty-report-by-user?";
    if (userId !== undefined && userId !== null)
        url_ += "userId=" + encodeURIComponent("" + userId) + "&";
    if (fromMonth === null)
        throw new Error("The parameter 'fromMonth' cannot be null.");
    else if (fromMonth !== undefined)
        url_ += "fromMonth=" + encodeURIComponent("" + fromMonth) + "&";
    if (fromYear === null)
        throw new Error("The parameter 'fromYear' cannot be null.");
    else if (fromYear !== undefined)
        url_ += "fromYear=" + encodeURIComponent("" + fromYear) + "&";
    if (toMonth === null)
        throw new Error("The parameter 'toMonth' cannot be null.");
    else if (toMonth !== undefined)
        url_ += "toMonth=" + encodeURIComponent("" + toMonth) + "&";
    if (toYear === null)
        throw new Error("The parameter 'toYear' cannot be null.");
    else if (toYear !== undefined)
        url_ += "toYear=" + encodeURIComponent("" + toYear) + "&";
    url_ = url_.replace(/[?&]$/, "");


    return this.http.get<RoyaltyReportByUserDto[]>( url_)
    }

    getTransactionHistory(keyword?: string | null | undefined, fromMonth?: number | undefined, 
        fromYear?: number | undefined, toMonth?: number | undefined, toYear?: number | undefined, 
        pageIndex?: number | undefined, pageSize?: number | undefined): Observable<TransactionDtoPagedResult> {
        let url_ = this.baseUrl + "/api/admin/royalty/transaction-histories?";
        if (keyword !== undefined && keyword !== null)
            url_ += "keyword=" + encodeURIComponent("" + keyword) + "&";
        if (fromMonth === null)
            throw new Error("The parameter 'fromMonth' cannot be null.");
        else if (fromMonth !== undefined)
            url_ += "fromMonth=" + encodeURIComponent("" + fromMonth) + "&";
        if (fromYear === null)
            throw new Error("The parameter 'fromYear' cannot be null.");
        else if (fromYear !== undefined)
            url_ += "fromYear=" + encodeURIComponent("" + fromYear) + "&";
        if (toMonth === null)
            throw new Error("The parameter 'toMonth' cannot be null.");
        else if (toMonth !== undefined)
            url_ += "toMonth=" + encodeURIComponent("" + toMonth) + "&";
        if (toYear === null)
            throw new Error("The parameter 'toYear' cannot be null.");
        else if (toYear !== undefined)
            url_ += "toYear=" + encodeURIComponent("" + toYear) + "&";
        if (pageIndex === null)
            throw new Error("The parameter 'pageIndex' cannot be null.");
        else if (pageIndex !== undefined)
            url_ += "pageIndex=" + encodeURIComponent("" + pageIndex) + "&";
        if (pageSize === null)
            throw new Error("The parameter 'pageSize' cannot be null.");
        else if (pageSize !== undefined)
            url_ += "pageSize=" + encodeURIComponent("" + pageSize) + "&";
        url_ = url_.replace(/[?&]$/, "");


        return this.http.get<TransactionDtoPagedResult>( url_)
    }
}
