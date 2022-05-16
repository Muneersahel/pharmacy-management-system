import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ClientEndpoints } from 'src/app/core/enums/endpoints';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Injectable({
    providedIn: 'root',
})
export class AdminGuardService implements CanActivate {
    constructor(
        private authS: AuthService,
        private utilityS: UtilityService,
        private notificationS: NotificationService
    ) {}

    canActivate(
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        this.authS.isAuthUserAdmin()?.subscribe({
            next: (isAdmin) => {
                if (!isAdmin) {
                    this.notificationS.error(
                        'You are not authorized to access this page'
                    );
                    this.utilityS.navigateToURL(ClientEndpoints.DASHBOARD);
                }
            },
        });

        return this.authS.isAuthUserAdmin() as Observable<boolean>;
    }
}
