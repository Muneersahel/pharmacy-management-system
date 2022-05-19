import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClientEndpoints } from 'src/app/core/enums/endpoints';
import { User } from 'src/app/core/interfaces/user.interface';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
    selector: 'app-user-card',
    templateUrl: './user-card.component.html',
    styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent implements OnInit {
    @Input() user: User = {} as User;
    @Output() deleteUser = new EventEmitter<number>();
    @Input() isDeleting: boolean = false;

    constructor(private utilityS: UtilityService) {}

    ngOnInit(): void {}

    onEditUser(id: number) {
        this.utilityS.navigateToURL(`${ClientEndpoints.USERS}/${id}/edit`);
    }

    onDeleteUser(id: number) {
        this.deleteUser.emit(id);
    }
}
