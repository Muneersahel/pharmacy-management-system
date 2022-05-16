import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth/services/auth.service';
import { Link } from './core/interfaces/link.interface';
import { User } from './core/interfaces/user.interface';
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

    authUser$: Observable<User> | null;
    isDeviceSmall$: Observable<boolean>;

    constructor(
        private authS: AuthService,
        private router: Router,
        private utilityS: UtilityService
    ) {
        this.authS.autoLogin();
        this.isDeviceSmall$ = this.utilityS.isDeviceSmall$;
        this.authUser$ = this.authS.getAuthUser();
        this.navigationLinks$ = this.authS.navigationLinnks$;
        this.router.events.forEach((event) => {
            if (event instanceof NavigationStart) {
                this.showSecureLayout = this.authS.isAuthenticated();
            }
        });
    }

    ngOnInit(): void {}

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
