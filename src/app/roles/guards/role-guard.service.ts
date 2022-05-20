import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
} from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ClientEndpoints } from 'src/app/core/enums/endpoints';
// import { ClientEndpoints } from 'src/app/core/enums/endpoints';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Injectable({
    providedIn: 'root',
})
export class AdminGuardService implements CanActivate {
    constructor(
        private authS: AuthService,
        private utilityS: UtilityService,
        private router: Router,
        private notificationS: NotificationService
    ) {}

    canActivate(
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.authS.isAuthUserAdmin().pipe(
            map((isAdmin) => {
                if (isAdmin) {
                    return true;
                }

                console.log(this.router.url);
                this.notificationS.error(
                    'You are not authorized to access this page'
                );
                this.utilityS.navigateToURL(ClientEndpoints.DASHBOARD);
                return false;
            })
        );
    }
}
