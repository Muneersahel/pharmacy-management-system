import {
    ActivatedRouteSnapshot,
    CanActivate,
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
export class AuthenticatedGuardService implements CanActivate {
    constructor(
        private authS: AuthService,
        private notificationS: NotificationService,
        private utilityS: UtilityService
    ) {}

    canActivate(
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot
    ): Observable<boolean> | boolean {
        return this.authS.isAuthenticated().pipe(
            map((isAuthenticated) => {
                if (!isAuthenticated) {
                    return true;
                }

                this.utilityS
                    .navigateToURL(ClientEndpoints.DASHBOARD)
                    .then(() => {
                        this.notificationS.info('You are already logged in.');
                    })
                    .catch((error) => {
                        console.log(error);
                    });

                return false;
            })
        );
    }
}
