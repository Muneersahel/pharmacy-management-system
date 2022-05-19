import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    constructor(private readonly snackBar: MatSnackBar) {}

    default(message: string, isHandset?: boolean): void {
        this.show(
            message,
            { duration: 3000, panelClass: 'default-notification-overlay' },
            isHandset
        );
    }

    info(message: string, isHandset?: boolean): void {
        this.show(
            message,
            { duration: 3000, panelClass: 'info-notification-overlay' },
            isHandset
        );
    }

    success(message: string, isHandset?: boolean): void {
        this.show(
            message,
            { duration: 3000, panelClass: 'success-notification-overlay' },
            isHandset
        );
    }

    warn(message: string, isHandset?: boolean): void {
        this.show(
            message,
            { duration: 3000, panelClass: 'warning-notification-overlay' },
            isHandset
        );
    }

    error(
        message: string | Array<{ message: string }>,
        isHandset?: boolean
    ): void {
        this.show(
            message,
            { duration: 3000, panelClass: 'error-notification-overlay' },
            isHandset
        );
    }

    private show(
        message: string | Array<{ message: string }>,
        configuration: MatSnackBarConfig,
        isHandset?: boolean
    ): void {
        if (!isHandset) {
            configuration.horizontalPosition = 'right';
            configuration.verticalPosition = 'top';
        }
        const action = 'OK';
        if (message instanceof Array) {
            message.forEach((msg, index) => {
                setTimeout(() => {
                    this.snackBar.open(msg.message, action, configuration);
                }, index * (2000 + 500));
            });
            return;
        }
        this.snackBar.open(message as string, action, configuration);
    }
}
