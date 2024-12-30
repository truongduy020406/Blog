import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UploadService {
  public responseData: any;

  private http = inject(HttpClient);

  uploadImage(type: string, files: File[]) {
    const formData: FormData = new FormData();
    formData.append('file', files[0], files[0].name);
    return this.http.post(environment.API_URL + "/api/admin/media?type=" + type, formData);;
  }
}
