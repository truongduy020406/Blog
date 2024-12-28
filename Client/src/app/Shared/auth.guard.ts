import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenStorageService } from '../Shared/Service/token.service'
import { UrlConstants } from  '../Shared/constants/Url.onstants';

@Injectable()
export class AuthGuard {
    
    private tokenService = inject(TokenStorageService);
    private router = inject(Router)

    canActivate(activateRoute: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): boolean {
        let requiredPolicy = activateRoute.data["requiredPolicy"] as string;
        var loggedInUser = this.tokenService.getUser();
        if (loggedInUser) {
            var listPermission = JSON.parse(loggedInUser.permissions);
            if (listPermission != null && listPermission != '' && listPermission.filter((x:any) => x == requiredPolicy).length > 0)
                return true;
            else {
                this.router.navigate([UrlConstants.ACCESS_DENIED], {
                    queryParams: {
                        returnUrl: routerState.url
                    }
                });
                return false;
            }
        }
        else {
            this.router.navigate([UrlConstants.LOGIN], {
                queryParams: {
                    returnUrl: routerState.url
                }
            });
            return false;
        }
    }
}