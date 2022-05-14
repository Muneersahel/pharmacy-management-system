import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
    declarations: [CapitalizePipe, LoadingComponent],
    imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
    exports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        CapitalizePipe,
        LoadingComponent,
    ],
})
export class SharedModule {}
