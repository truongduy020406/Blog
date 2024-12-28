import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withHashLocation, withInMemoryScrolling, withRouterConfig, withViewTransitions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ADMIN_API_BASE_URL } from './Views/Auth/Service/auth.service';
import { environment } from '../environments/environment';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TokenInterceptor } from './Shared/interceptors/token.interceptor';
import { GlobalHttpInterceptorService } from './Shared/interceptors/error-handle.interceptor';
import { AlertService } from './Shared/Service/alert.service';
import { AuthGuard } from './Shared/auth.guard';
import { UtilityService } from './Shared/Service/utility.service';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ADMIN_API_BASE_URL, useValue: environment.API_URL},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpInterceptorService,
      multi: true
    },
    provideRouter(routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withEnabledBlockingInitialNavigation(),
      withViewTransitions(),
      withHashLocation()
    ),
    AlertService,
    MessageService,

    AuthGuard,
    UtilityService,
    ConfirmationService,
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations()
  ]
};
