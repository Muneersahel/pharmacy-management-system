import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpInterceptor,
    HttpErrorResponse,
    HttpEvent,
} from '@angular/common/http';
import { Observable, catchError, ObservableInput, throwError } from 'rxjs';
import { NotificationService } from './shared/services/notification.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class ConnectionInterceptor implements HttpInterceptor {
    constructor(private notificationS: NotificationService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            catchError(
                (
                    err: HttpErrorResponse,
                    caught: Observable<HttpEvent<any>>
                ): ObservableInput<any> => {
                    if (!environment.production) {
                        console.log(err);
                    }

                    switch (err.status) {
                        case 400:
                            this.notificationS.error(err.error.errors);
                            break;
                        case 401:
                            this.notificationS.error(err.error.errors);
                            break;
                        case 404:
                            this.notificationS.error(err.error.errors);
                            break;
                        case 403:
                            this.notificationS.error(err.error.errors);
                            break;
                        case 500:
                            // todo: redirect to 500 error page
                            this.notificationS.error(
                                'Server is not responding. Please try again later.'
                            );
                            break;
                        default:
                            this.notificationS.error(
                                'An error occurred. Please try again later.'
                            );
                            break;
                    }

                    // return of([]);
                    return throwError(() => new Error(err.toString()));
                }
            )
        );
    }
}
