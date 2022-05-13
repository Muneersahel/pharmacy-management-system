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

  error(message: string, isHandset?: boolean): void {
    this.show(
      message,
      { duration: 3000, panelClass: 'error-notification-overlay' },
      isHandset
    );
  }

  private show(
    message: string,
    configuration: MatSnackBarConfig,
    isHandset?: boolean
  ): void {
    // For desktop, move notification to the right
    if (!isHandset) {
      configuration.horizontalPosition = 'right';
      configuration.verticalPosition = 'top';
    }
    const action = 'OK';
    this.snackBar.open(message, action, configuration);
  }
}
