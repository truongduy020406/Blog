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
import { AlertService } from '../service/alert.service';

@Injectable()
export class GlobalHttpInterceptorService implements HttpInterceptor {

  private alertService = inject(AlertService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(ex => {
        console.log(ex);
        if (ex.status == 500) {
          this.alertService.showError('Hệ thống có lỗi xảy ra. Vui lòng liên hệ admin');
        }
        throw ex;
      })
    );
  }
}