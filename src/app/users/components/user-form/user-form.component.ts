import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ClientEndpoints } from 'src/app/core/enums/endpoints';
import { Role } from 'src/app/core/interfaces/role.interface';
import { User } from 'src/app/core/interfaces/user.interface';
import { RoleService } from 'src/app/roles/services/role.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit, OnDestroy {
    userFormGroup: FormGroup;
    mode = 'create';
    isPasswordVisible = false;
    userRolesArray: Role[] = [];
    userId: number | undefined;
    isLoading: boolean = false;
    destroy$ = new Subject<void>();

    constructor(
        private utilityS: UtilityService,
        private userS: UserService,
        private notificationS: NotificationService,
        private route: ActivatedRoute,
        private roleS: RoleService
    ) {
        this.userFormGroup = new FormGroup({
            name: new FormControl(null, [Validators.required]),
            email: new FormControl(null, [
                Validators.required,
                Validators.email,
            ]),
            contact: new FormControl(null, [
                Validators.required,
                Validators.minLength(9),
                Validators.pattern('[0-9]*'),
            ]),
            roleName: new FormControl(null, [Validators.required]),
        });

        this.route.params.subscribe((params: Params) => {
            this.userId = params['userId'];
            console.log(this.userId);

            if (this.userId) {
                this.mode = 'edit';
                this.userS
                    .getUser(this.userId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((response) => {
                        this.userFormGroup.patchValue({
                            name: response.name,
                            email: response.email,
                            contact: response.contact,
                            roleName: response.role?.name,
                        });
                    });
            }
        });
    }

    ngOnInit(): void {
        this.getRoles();
    }

    getRoles() {
        this.roleS
            .getRoles()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.userRolesArray = response.data.roles;
                },
                error: (err) => {
                    this.notificationS.error(err.error.message);
                },
            });
    }

    backToUserList() {
        this.utilityS.navigateToURL(ClientEndpoints.USERS);
    }

    onSubmitUserForm() {
        if (!this.userFormGroup.valid) {
            return;
        }

        this.isLoading = true;
        const user: User = this.userFormGroup.value;

        let userForm$;
        if (this.mode === 'create') {
            userForm$ = this.userS.createUser(user);
        } else {
            userForm$ = this.userS.updateUser(user, this.userId);
        }

        userForm$.pipe(takeUntil(this.destroy$)).subscribe({
            next: (response) => {
                this.isLoading = false;
                this.notificationS.success(response.message);
                this.backToUserList();
            },
            error: (err) => {
                this.isLoading = false;
                this.notificationS.error(err.error.message);
            },
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
