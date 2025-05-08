import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { WorkflowListComponent } from './list.component';
import { WorkflowRoutingModule } from './workflow-routing.module';

@NgModule({
    declarations: [
        
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        WorkflowRoutingModule,
        WorkflowListComponent
    ]
})
export class WorkflowModule { }