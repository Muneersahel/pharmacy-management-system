import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ClientEndpoints } from 'src/app/core/enums/endpoints';
import { Role } from 'src/app/core/interfaces/role.interface';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RoleService } from '../../services/role.service';

@Component({
    selector: 'app-role-form',
    templateUrl: './role-form.component.html',
    styleUrls: ['./role-form.component.scss'],
})
export class RoleFormComponent implements OnInit {
    roleFormGroup: FormGroup;
    isLoading: boolean = false;
    mode = 'create';
    roleId: number | undefined;
    destroy$ = new Subject<void>();

    constructor(
        private roleS: RoleService,
        private utilityS: UtilityService,
        private notificationS: NotificationService,
        private route: ActivatedRoute
    ) {
        this.roleFormGroup = new FormGroup({
            name: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
        });

        this.route.params.subscribe((params) => {
            if (params['roleId']) {
                this.mode = 'edit';
                this.roleId = params['roleId'];
                this.roleS
                    .getRole(this.roleId!)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((response) => {
                        this.roleFormGroup.patchValue({
                            name: response.role.name,
                            description: response.role.description,
                        });
                    });
            }
        });
    }

    ngOnInit(): void {}

    backToRoleList() {
        this.utilityS.navigateToURL(ClientEndpoints.USER_ROLES);
    }

    onSubmitRoleForm() {
        if (!this.roleFormGroup.valid) {
            return;
        }

        this.isLoading = true;
        const role: Role = this.roleFormGroup.value;

        let roleForm$;
        if (this.mode === 'create') {
            roleForm$ = this.roleS.createRole(role);
        } else {
            roleForm$ = this.roleS.updateRole(this.roleId!, role);
        }

        roleForm$.pipe(takeUntil(this.destroy$)).subscribe({
            next: (response) => {
                this.isLoading = false;
                this.notificationS.success(response.message);
                this.backToRoleList();
            },
            error: (err) => {
                this.isLoading = false;
                this.notificationS.error(err.error.message);
            },
        });
    }
}
