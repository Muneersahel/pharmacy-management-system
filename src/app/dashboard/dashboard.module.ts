import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [{ path: '', component: DashboardComponent }];

@NgModule({
    declarations: [DashboardComponent],
    imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class DashboardModule {}
