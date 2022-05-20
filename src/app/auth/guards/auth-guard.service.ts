import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthService } from '../services/auth.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ClientEndpoints } from 'src/app/core/enums/endpoints';

@Injectable({
    providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
    constructor(
        private authS: AuthService,
        private notificationS: NotificationService,
        private utilityS: UtilityService,
        private router: Router
    ) {}

    canActivate(
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot
    ): Observable<boolean> | boolean {
        return this.authS.isAuthenticated().pipe(
            map((isAuthenticated) => {
                if (isAuthenticated) {
                    return true;
                }

                this.utilityS
                    .navigateToURL(ClientEndpoints.LOGIN)
                    .then(() => {
                        if (this.router.url !== ClientEndpoints.LOGIN) {
                            this.authS.setRedirectUrl(this.router.url);
                        }

                        this.notificationS.error('Please login to continue');
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                this.router.navigate([ClientEndpoints.LOGIN]);
                return false;
            })
        );
    }
}
