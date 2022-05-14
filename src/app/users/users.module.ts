import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { UserCardComponent } from './components/user-list/user-card/user-card.component';

const routes: Routes = [
    { path: '', component: UserListComponent },
    { path: 'create', component: UserFormComponent },
    { path: ':userId/edit', component: UserFormComponent },
];

@NgModule({
    declarations: [UserListComponent, UserFormComponent, UserCardComponent],
    imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class UsersModule {}
