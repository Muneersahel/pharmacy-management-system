import {
    ActivatedRouteSnapshot,
    CanActivate,
    RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
    ): Observable<boolean> | Promise<boolean> | boolean {
        if (this.authS.isAuthenticated()) {
            this.utilityS.navigateToURL(ClientEndpoints.DASHBOARD).then(() => {
                this.notificationS.info('You are already logged in.');
            });
            return false;
        }
        return true;
    }
}
