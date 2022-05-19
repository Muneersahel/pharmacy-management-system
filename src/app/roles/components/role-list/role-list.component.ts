import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ClientEndpoints } from 'src/app/core/enums/endpoints';
import { Role } from 'src/app/core/interfaces/role.interface';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RoleService } from '../../services/role.service';

@Component({
    selector: 'app-role-list',
    templateUrl: './role-list.component.html',
    styleUrls: ['./role-list.component.scss'],
})
export class RoleListComponent implements OnInit, OnDestroy {
    isLoading: boolean = false;
    roleList: Role[] = [];
    isDeleting: boolean = false;
    isRestoring: boolean = false;
    destroy$ = new Subject<void>();

    constructor(
        private utilityS: UtilityService,
        private roleS: RoleService,
        private notificationS: NotificationService
    ) {}

    ngOnInit(): void {
        this.getRoles();
    }

    getRoles() {
        this.isLoading = true;
        this.roleS.getRoles().pipe(takeUntil(this.destroy$)).subscribe();

        this.roleS.rolesSubject.pipe(takeUntil(this.destroy$)).subscribe({
            next: (roles) => {
                this.isLoading = false;
                this.roleList = roles;
            },
            error: (err) => {
                this.isLoading = false;
                this.notificationS.error(err.error.message);
            },
        });
    }

    onAddRole() {
        this.utilityS.navigateToURL(
            `${ClientEndpoints.USER_ROLES}${ClientEndpoints.CREATE}`
        );
    }

    onEditRole(role: Role) {
        this.utilityS.navigateToURL(
            `${ClientEndpoints.USER_ROLES}/${role.id}${ClientEndpoints.EDIT}`
        );
    }

    onDeleteRole(role: Role) {
        if (confirm(`Are you sure you want to delete role ${role.name}?`)) {
            this.isDeleting = true;
            this.roleS.deleteRole(role.id).subscribe({
                next: () => {
                    this.notificationS.success(
                        `Role ${role.name} has been deleted successfully.`
                    );
                    this.isDeleting = false;
                },
                error: () => {
                    this.isDeleting = false;
                },
            });
        }
    }

    onRestoreRole(role: Role) {
        this.isRestoring = true;
        this.roleS
            .restoreRole(role.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.notificationS.success(
                        `Role ${role.name} has been restored successfully.`
                    );
                    this.isRestoring = false;
                },
                error: () => {
                    this.isRestoring = false;
                },
            });
    }

    onDeleteRolePermanently(role: Role) {
        if (
            confirm(
                `Are you sure you want to delete role ${role.name} permanently?`
            )
        ) {
            this.isDeleting = true;
            this.roleS
                .deleteRolePermanently(role.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: () => {
                        this.notificationS.success(
                            `Role ${role.name} has been deleted permanently.`
                        );
                        this.isDeleting = false;
                    },
                    error: () => {
                        this.isDeleting = false;
                    },
                });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
