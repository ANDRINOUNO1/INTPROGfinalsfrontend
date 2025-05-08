import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { EmployeeListComponent } from './list.component';
import { AddEditEmployeeComponent } from './add-edit.component';
import { EmployeeRoutingModule } from './employee-routing.module';

@NgModule({
    declarations: [
        EmployeeListComponent,
        AddEditEmployeeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        EmployeeRoutingModule,
        
    ]
})
export class EmployeeModule { }