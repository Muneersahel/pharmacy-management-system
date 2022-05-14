import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth/services/auth.service';
import { ClientEndpoints } from './core/enums/endpoints';
import { Link } from './core/interfaces/link.interface';
import { User } from './core/interfaces/user.interface';
import { NotificationService } from './shared/services/notification.service';
import { UtilityService } from './shared/services/utility.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'Pharmacy <anagement System';

    showSecureLayout = false;
    navigationLinks$: Observable<Link[]> = new Observable();

    authUser: User = {} as User;
    isDeviceSmall$: Observable<boolean>;

    constructor(
        private authS: AuthService,
        private router: Router,
        private utilityS: UtilityService,
        private notificationS: NotificationService
    ) {
        this.authS.autoLogin();
        this.isDeviceSmall$ = this.utilityS.isDeviceSmall$;
        this.navigationLinks$ = this.authS.navigationLinksSubject;
        this.router.events.forEach((event) => {
            if (event instanceof NavigationStart) {
                this.showSecureLayout = event.url !== ClientEndpoints.LOGIN;
            }
        });
    }

    ngOnInit(): void {
        if (this.authS.isAuthenticated()) {
            this.authS.getAuthUser().subscribe({
                next: (user) => {
                    this.authUser = user;
                },
                error: (err) => {
                    this.notificationS.error(err);
                },
            });
        }
    }

    closeDrawer(drawer: any) {
        this.isDeviceSmall$.subscribe((isDeviceSmall) => {
            if (isDeviceSmall) {
                drawer.close();
            }
        });
    }

    logout() {
        this.authS.logout();
    }
}
