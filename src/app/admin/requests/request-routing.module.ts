import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RequestListComponent } from './list.component';
import { AddEditRequestComponent } from './add-edit.component';

const routes: Routes = [
    { path: '', component: RequestListComponent },
    { path: 'add', component: AddEditRequestComponent },
    { path: 'edit/:id', component: AddEditRequestComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RequestsRoutingModule { }