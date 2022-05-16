import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ClientEndpoints } from 'src/app/core/enums/endpoints';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AuthService } from '../services/auth.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    isLoading: boolean = false;
    loginFormGroup: FormGroup;
    isLoginFormSubmitted: boolean;
    isPasswordVisible: boolean;
    destroy$ = new Subject<void>();
    subscriptions: Subscription = new Subscription();

    forgotPasswordRoute = ClientEndpoints.FORGOT_PASSWORD;

    constructor(
        private authS: AuthService,
        private notificationS: NotificationService,
        private utilityS: UtilityService
    ) {
        this.isLoginFormSubmitted = false;
        this.isPasswordVisible = false;
        this.loginFormGroup = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.email,
            ]),
            password: new FormControl(null, [Validators.required]),
        });
    }

    ngOnInit(): void {
        this.utilityS.setPageTitle('Login');
    }

    get f() {
        return this.loginFormGroup.controls;
    }

    onSubmtLoginForm(): void {
        this.isLoginFormSubmitted = true;
        if (this.loginFormGroup.invalid) {
            return;
        }

        this.isLoading = true;
        const loginPayload: { email: string; password: string } = {
            email: this.f['email'].value,
            password: this.f['password'].value,
        };

        this.authS
            .loginUser(loginPayload)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (message) => {
                    this.isLoading = false;
                    this.notificationS.success(message);
                },
                error: (error) => {
                    this.isLoading = false;
                    console.log(error);
                    this.notificationS.error(error.error.message);
                },
            });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
