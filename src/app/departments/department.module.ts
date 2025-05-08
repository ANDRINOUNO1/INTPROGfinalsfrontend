import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { DepartmentListComponent } from './list.component';
import { AddEditDepartmentComponent } from './add-edit.component';
import { DepartmentRoutingModule } from './department-routing.module';

@NgModule({
    declarations: [
        DepartmentListComponent,
        AddEditDepartmentComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DepartmentRoutingModule
    ]
})
export class DepartmentModule { }