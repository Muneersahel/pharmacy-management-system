import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpInterceptor,
} from '@angular/common/http';
import { AuthUser } from '../../core/classes/user.class';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authS: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        const loadedUser = <AuthUser>this.authS.getStoredAuthUser();

        if (loadedUser?.accessToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${loadedUser.accessToken}`,
                },
            });
        }

        return next.handle(request);
    }
}
