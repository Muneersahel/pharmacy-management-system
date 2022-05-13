import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, of, Subscription, tap } from 'rxjs';
import { AuthUser } from 'src/app/core/classes/user.class';
import { ApiEndpoints, ClientEndpoints } from 'src/app/core/enums/endpoints';
import {
  loginPayload,
  loginResponse,
} from 'src/app/core/interfaces/user.interface';
import { StorageService } from 'src/app/shared/services/storage.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private redirectUrl: string = ClientEndpoints.DASHBOARD;
  authUser = new BehaviorSubject<AuthUser>({} as AuthUser);
  private tokenExpirationTimer: any;

  constructor(
    private utilityS: UtilityService,
    private storageS: StorageService,
    private http: HttpClient
  ) {}

  public setRedirectUrl(url: string) {
    this.redirectUrl = url;
  }

  loginUser(loginPayload: loginPayload) {
    return this.http
      .post<loginResponse>(
        `${environment.apiUrl}${ApiEndpoints.USERS}${ApiEndpoints.LOGIN}`,
        loginPayload
      )
      .pipe(
        tap((response) => {
          this.handleAuthentication(
            response.accessToken,
            response.refreshToken
          );
        }),
        map((response) => {
          return response.message;
        })
      );
  }

  autoLogin() {
    const loadedUser = <AuthUser>this.getAuthUser();
    if (loadedUser?.accessToken) {
      this.authUser.next(loadedUser);
      const expirationDuration =
        new Date(<Date>(<unknown>loadedUser.tokenExpirationDate)).getTime() -
        new Date().getTime();
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

    this.authUser.next(authUser);
    this.storageS.setLocalObject('authUser', authUser);
    this.utilityS.navigateToURL(this.redirectUrl);
    this.autoLogout(expirationTime);
  }

  registerUser(registerPayload: any) {}

  logout() {
    clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = null;
    this.authUser.next({} as AuthUser);
    this.storageS.clearLocalStorage();
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  getAuthUser() {
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
    const loadedUser = <AuthUser>this.getAuthUser();
    if (loadedUser.accessToken) {
      const isTokenExpired =
        new Date(<Date>loadedUser.tokenExpirationDate) < new Date();
      return !isTokenExpired;
    }
    return false;
  }
}
