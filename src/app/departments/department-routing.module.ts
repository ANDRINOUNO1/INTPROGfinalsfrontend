import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DepartmentListComponent } from './list.component';
import { AddEditDepartmentComponent } from './add-edit.component';

const routes: Routes = [
    { path: '', component: DepartmentListComponent },
    { path: 'add', component: AddEditDepartmentComponent },
    { path: 'edit/:id', component: AddEditDepartmentComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DepartmentRoutingModule { }