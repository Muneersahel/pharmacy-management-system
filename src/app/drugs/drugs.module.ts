import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrugListComponent } from './components/drug-list/drug-list.component';
import { DrugFormComponent } from './components/drug-form/drug-form.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DrugCardComponent } from './components/drug-list/drug-card/drug-card.component';

const routes: Routes = [
    { path: '', component: DrugListComponent },
    { path: 'create', component: DrugFormComponent },
    { path: ':drugId/edit', component: DrugFormComponent },
];

@NgModule({
    declarations: [DrugListComponent, DrugFormComponent, DrugCardComponent],
    imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class DrugsModule {}
