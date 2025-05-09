import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { RequestListComponent } from './list.component';
import { AddEditRequestComponent } from './add-edit.component';
import { RequestsRoutingModule } from './request-routing.module';

@NgModule({
    declarations: [
        RequestListComponent,
        AddEditRequestComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RequestsRoutingModule,
        
    ]
})
export class RequestsModule { }