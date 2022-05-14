import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoleListComponent } from './components/role-list/role-list.component';
import { RoleFormComponent } from './components/role-form/role-form.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
    { path: '', component: RoleListComponent },
    { path: 'create', component: RoleFormComponent },
    { path: ':roleId/edit', component: RoleFormComponent },
];

@NgModule({
    declarations: [RoleListComponent, RoleFormComponent],
    imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class RolesModule {}
