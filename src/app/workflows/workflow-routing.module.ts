import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkflowListComponent } from './list.component';

const routes: Routes = [
    { path: '', component: WorkflowListComponent },
    { path: 'employee/:id', component: WorkflowListComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WorkflowRoutingModule { }