import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ClientEndpoints } from 'src/app/core/enums/endpoints';
import { User } from 'src/app/core/interfaces/user.interface';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
    userList: User[] = [];
    destroy$ = new Subject<void>();

    isLoading: boolean = false;
    isDeletinUser: boolean = false;

    constructor(
        private userS: UserService,
        private notificationS: NotificationService,
        private utilityS: UtilityService
    ) {}

    ngOnInit(): void {
        this.getUsersList();
    }

    getUsersList() {
        this.isLoading = true;
        this.userS
            .getUsers()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response) => {
                    this.userList = response.users;
                    this.isLoading = false;
                },
                error: (err) => {
                    this.isLoading = false;
                    this.notificationS.error(err.error.message);
                },
            });
    }

    onAddUser() {
        this.utilityS.navigateToURL(
            `${ClientEndpoints.USERS}${ClientEndpoints.CREATE}`
        );
    }

    deleteUser(id: number) {
        this.isDeletinUser = true;
        if (confirm('Are you sure you want to delete this user?')) {
            this.userS
                .deleteUser(id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (response) => {
                        this.notificationS.success(response.message);
                        this.isDeletinUser = false;
                    },
                    error: () => {
                        this.isDeletinUser = false;
                    },
                });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
