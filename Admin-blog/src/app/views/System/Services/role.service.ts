import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ADMIN_API_BASE_URL } from '../../Auth/Service/auth.service';
import { RoleDtoPagedResult } from '../Model/RoleDtoPagedResult.model';
import { catchError, mergeMap, Observable, of, throwError } from 'rxjs';
import { CreateUpdateRoleRequest } from '../Model/CreateUpdateRoleRequest.model'
import { RoleDto } from '../Model/RoleDto.model';
import { PermissionDto } from '../Model/PermissionDto.model'
@Injectable({
  providedIn: 'root'
})
export class RoleService {
    private http = inject(HttpClient);
    private baseUrl  = inject(ADMIN_API_BASE_URL);
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    getRolesAllPaging(keyword?: string | null | undefined, pageIndex?: number | undefined, pageSize?: number | undefined): Observable<RoleDtoPagedResult> {
        let url_ = this.baseUrl + "/api/admin/role/paging?";
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
        
    

        return this.http.get(url_)
    }


    blobToText(blob: any): Observable<string> {
        return new Observable<string>((observer: any) => {
            if (!blob) {
            observer.next("");
            observer.complete();
            } else {
                let reader = new FileReader();
                reader.onload = event => {
                observer.next((event.target as any).result);
                observer.complete();
            };
            reader.readAsText(blob);
        }
    });
    }

    createRole(body?: CreateUpdateRoleRequest) {
        let url_ = this.baseUrl + "/api/admin/role";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);

        return this.http.post( url_, body)
    }


    updateRole(id: string, body?: CreateUpdateRoleRequest | undefined) {
        let url_ = this.baseUrl + "/api/admin/role/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        return this.http.put(url_, body)
    }



    getRoleById(id: string): Observable<RoleDto> {
        let url_ = this.baseUrl + "/api/admin/role/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        return this.http.get(url_)
    }


    deleteRoles(ids?: string[] | null | undefined) {
        let url_ = this.baseUrl + "/api/admin/role?";
        if (ids !== undefined && ids !== null)
            ids && ids.forEach(item => { url_ += "ids=" + encodeURIComponent("" + item) + "&"; });
        url_ = url_.replace(/[?&]$/, "");

        let options_ : any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
            })
        };

        return this.http.delete(url_, options_)
    }


    getAllRolePermissions(roleId: string | null): Observable<PermissionDto> {
        let url_ = this.baseUrl + "/api/admin/role/{roleId}/permissions";
        if (roleId === undefined || roleId === null)
            throw new Error("The parameter 'roleId' must be defined.");
        url_ = url_.replace("{roleId}", encodeURIComponent("" + roleId));
        url_ = url_.replace(/[?&]$/, "");

        return this.http.get(url_)
            
    }


    savePermission(body?: PermissionDto | undefined){
        let url_ = this.baseUrl + "/api/admin/role/permissions";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(body);


        return this.http.put(url_, body)
    }

}
