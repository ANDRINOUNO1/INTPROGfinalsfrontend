import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Workflow } from './workflow';

@Injectable({
    providedIn: 'root'
})
export class WorkflowService {
    private baseUrl = 'http://localhost:4000/workflows';

    constructor(private http: HttpClient) {}

    // Get workflows for a specific employee
    getWorkflowsByEmployeeId(employeeId: number): Observable<Workflow[]> {
        return this.http.get<Workflow[]>(`${this.baseUrl}/employee/${employeeId}`);
    }

    // Get all workflows
    getWorkflows(): Observable<Workflow[]> {
        return this.http.get<Workflow[]>(this.baseUrl);
    }

    // Create a new workflow
    createWorkflow(workflow: Partial<Workflow>): Observable<Workflow> {
        return this.http.post<Workflow>(this.baseUrl, workflow);
    }

    // Update the status of a workflow
    updateWorkflowStatus(workflowId: number, status: string): Observable<Workflow> {
        return this.http.put<Workflow>(`${this.baseUrl}/${workflowId}`, { status });
    }

    // Delete a workflow
    deleteWorkflow(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
    }
}