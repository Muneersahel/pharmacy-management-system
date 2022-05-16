import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpInterceptor,
    HttpErrorResponse,
    HttpEvent,
} from '@angular/common/http';
import { Observable, catchError, throwError, ObservableInput } from 'rxjs';
import { NotificationService } from './shared/services/notification.service';

@Injectable()
export class ConnectionInterceptor implements HttpInterceptor {
    constructor(private notificationS: NotificationService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            catchError(
                (
                    err: any,
                    caught: Observable<HttpEvent<any>>
                ): ObservableInput<any> => {
                    if (err instanceof HttpErrorResponse) {
                        if (err.status === 0) {
                            // todo: redirect to 500 error page
                            this.notificationS.error(
                                'Server is not responding. Please try again later.'
                            );
                            return throwError(
                                () =>
                                    new Error('Unable to Connect to the Server')
                            );
                        }
                    }
                    return throwError(() => new Error(err));
                }
            )
        );
    }
}
