import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import { Role } from 'src/app/core/interfaces/role.interface';

@Component({
    selector: 'app-role-card',
    templateUrl: './role-card.component.html',
    styleUrls: ['./role-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleCardComponent implements OnInit {
    @Input() role: Role = {} as Role;
    @Input() isDeleting: boolean = false;
    @Input() isRestoring: boolean = false;
    @Output() editRole = new EventEmitter<Role>();
    @Output() retoreRole = new EventEmitter<Role>();
    @Output() deleteRole = new EventEmitter<Role>();
    @Output() deleteRolePermanently = new EventEmitter<Role>();

    constructor() {}

    ngOnInit(): void {}

    onEditRole(role: Role) {
        this.editRole.emit(role);
    }

    onRestoreRole(role: Role) {
        this.retoreRole.emit(role);
    }

    onDeleteRole(role: Role) {
        this.deleteRole.emit(role);
    }

    onDeleteRolePermanently(role: Role) {
        this.deleteRolePermanently.emit(role);
    }
}
