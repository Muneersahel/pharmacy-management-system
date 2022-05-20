import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, of, tap } from 'rxjs';
import { AuthUser } from 'src/app/core/classes/user.class';
import { UserRoles } from 'src/app/core/enums/constants';
import { ApiEndpoints, ClientEndpoints } from 'src/app/core/enums/endpoints';
import { Link } from 'src/app/core/interfaces/link.interface';
import { User } from 'src/app/core/interfaces/user.interface';
import {
    adminNavigationLinks,
    pharmacistNavigationLinks,
} from 'src/app/navigation-links';
import { StorageService } from 'src/app/shared/services/storage.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private redirectUrl: string = ClientEndpoints.DASHBOARD;
    private tokenExpirationTimer: any;
    private navigationLinksSubject = new BehaviorSubject<Link[]>([]);
    navigationLinks$ = this.navigationLinksSubject.asObservable();

    constructor(
        private utilityS: UtilityService,
        private storageS: StorageService,
        private http: HttpClient
    ) {}

    public setRedirectUrl(url: string) {
        this.redirectUrl = url;
    }

    loginUser(loginPayload: { email: string; password: string }) {
        return this.http
            .post<{
                message: string;
                accessToken: string;
                refreshToken: string;
                user: User;
            }>(
                `${environment.apiUrl}${ApiEndpoints.USERS}${ApiEndpoints.LOGIN}`,
                loginPayload
            )
            .pipe(
                tap((response) => {
                    this.handleAuthentication(
                        response.accessToken,
                        response.refreshToken
                    );
                    this.getAuthUser()?.subscribe();
                    this.setNavigationLinks(response.user);
                }),
                map((response) => {
                    return response.message;
                })
            );
    }

    getAuthUser() {
        return this.http
            .get<{ message: string; user: User }>(
                `${environment.apiUrl}${ApiEndpoints.USERS}${ApiEndpoints.AUTH_USER}`
            )
            .pipe(
                map((response) => {
                    return response.user;
                }),
                tap((response) => {
                    this.setNavigationLinks(response);
                })
            );
    }

    private setNavigationLinks(response: User) {
        if (response.role?.name == UserRoles.ADMIN) {
            this.navigationLinksSubject.next(adminNavigationLinks);
        }
        if (response.role?.name == UserRoles.PHARMACIST) {
            this.navigationLinksSubject.next(pharmacistNavigationLinks);
        }
    }

    autoLogin() {
        const loadedUser = <AuthUser>this.getStoredAuthUser();
        if (loadedUser?.accessToken) {
            // this.authUser.next(loadedUser);
            const expirationDuration =
                new Date(
                    <Date>(<unknown>loadedUser.tokenExpirationDate)
                ).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    private handleAuthentication(accessToken: string, refreshToken: string) {
        const payload = atob(accessToken.split('.')[1]);
        const parsedPayload = JSON.parse(payload);
        const expirationDate = new Date(+parsedPayload.exp * 1000);
        const expirationTime = expirationDate.getTime() - new Date().getTime();
        const authUser = new AuthUser(
            accessToken,
            refreshToken,
            <Date>expirationDate
        );

        this.storageS.setLocalObject('authUser', authUser);
        this.utilityS.navigateToURL(this.redirectUrl);
        this.autoLogout(expirationTime);
    }

    logout() {
        clearTimeout(this.tokenExpirationTimer);
        this.tokenExpirationTimer = null;
        this.storageS.clearLocalStorage();
        this.utilityS.navigateToURL(ClientEndpoints.LOGIN);
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    getStoredAuthUser() {
        const authUser: {
            _accessToken: string;
            _refreshToken: string;
            _tokenExpirationDate: Date;
        } = this.storageS.getLocalObject('authUser');
        if (!authUser) {
            return;
        }

        const loadedUser = new AuthUser(
            authUser._accessToken,
            authUser._refreshToken,
            new Date(authUser._tokenExpirationDate)
        );

        return loadedUser;
    }

    isAuthenticated() {
        const loadedUser = <AuthUser>this.getStoredAuthUser();
        if (loadedUser?.accessToken) {
            const isTokenExpired =
                new Date(<Date>loadedUser.tokenExpirationDate) < new Date();
            return of(!isTokenExpired);
        }
        return of(false);
    }

    isAuthUserAdmin() {
        return this.getAuthUser().pipe(
            map((user) => {
                return user.role?.name === UserRoles.ADMIN;
            })
        );
    }

    refreshToken() {
        const loadedUser = <AuthUser>this.getStoredAuthUser();
        if (!loadedUser) {
            return;
        }
        return this.http
            .post<{
                message: string;
                accessToken: string;
                refreshToken: string;
                user: User;
            }>(
                `${environment.apiUrl}${ApiEndpoints.USERS}${ApiEndpoints.REFRESH_TOKEN}`,
                { refreshToken: loadedUser.refreshToken }
            )
            .pipe(
                tap((response) => {
                    this.handleAuthentication(
                        response.accessToken,
                        response.refreshToken
                    );
                    this.getAuthUser();
                }),
                map((response) => {
                    return response.message;
                })
            );
    }
}
