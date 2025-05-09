import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkflowService } from './workflow.service';
import { Workflow } from './workflow';

@Component({
    selector: 'app-workflow-list',
    templateUrl: './list.component.html',
    standalone: true,
})
export class WorkflowListComponent implements OnInit {
    employeeId!: number; // ID of the employee whose workflows are being displayed
    workflows: Workflow[] = [];
    errorMessage: string = '';

    constructor(
        private workflowService: WorkflowService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.employeeId = this.route.snapshot.params['id'];
        this.loadWorkflows();
    }

    // Load workflows for the employee
    loadWorkflows(): void {
        this.workflowService.getWorkflowsByEmployeeId(this.employeeId).subscribe({
            next: (data) => (this.workflows = data),
            error: (err) => (this.errorMessage = 'Failed to load workflows')
        });
    }

    // Update the status of a workflow
    updateStatus(workflow: Workflow): void {
        this.workflowService.updateWorkflowStatus(workflow.id, workflow.status).subscribe({
            next: () => console.log('Workflow status updated successfully'),
            error: (err) => (this.errorMessage = 'Failed to update workflow status')
        });
    }

    // Check the current user's role
    account(): { role: string } | null {
        // Simulate fetching the current user's account details
        return { role: 'Admin' }; // Replace with actual logic if needed
    }
}