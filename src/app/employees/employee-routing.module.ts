import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmployeeListComponent } from './list.component';
import { AddEditEmployeeComponent } from './add-edit.component';

const routes: Routes = [
    { path: '', component: EmployeeListComponent },
    { path: 'add', component: AddEditEmployeeComponent },
    { path: 'edit/:id', component: AddEditEmployeeComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeeRoutingModule { }