import { Component, OnInit } from '@angular/core';
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
export class RoleListComponent implements OnInit {
    isLoading: boolean = false;
    roleList: { count: number; roles: Role[] } = {
        count: 0,
        roles: [],
    };
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
        this.roleS.getRoles().subscribe({
            next: (response) => {
                this.isLoading = false;
                this.roleList = response.data;
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
        this.roleS.deleteRole(role.id).subscribe({
            next: () => {
                this.notificationS.success(
                    `Role ${role.name} has been deleted successfully.`
                );
            },
            error: (err) => {
                this.notificationS.error(err.error.message);
            },
        });
    }

    onRestoreRole(role: Role) {
        this.roleS
            .restoreRole(role.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.notificationS.success(
                        `Role ${role.name} has been restored successfully.`
                    );
                },
                error: (err) => {
                    this.notificationS.error(err.error.message);
                },
            });
    }
}
