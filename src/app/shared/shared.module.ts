import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { LoadingComponent } from './components/loading/loading.component';
import { SimplePageComponent } from './components/simple-page/simple-page.component';
import { TitleComponent } from './components/title/title.component';

@NgModule({
    declarations: [
        CapitalizePipe,
        LoadingComponent,
        SimplePageComponent,
        TitleComponent,
    ],
    imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
    exports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        CapitalizePipe,
        LoadingComponent,
        SimplePageComponent,
        TitleComponent,
    ],
})
export class SharedModule {}
