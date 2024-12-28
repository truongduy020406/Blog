import { inject, Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../Service/alert.service';

@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor {

  private alertService = inject(AlertService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(async ex => {
        console.log(ex);
        if (ex.status == 500) {
          this.alertService.showError('Hệ thống có lỗi xảy ra. Vui lòng liên hệ admin');
        }
        if (ex.status == 400 || ex.status == 401) {
          const error = await (new Response(ex.error)).text();
          this.alertService.showError(error);
        }
        throw ex;
      })
    );
  }
}