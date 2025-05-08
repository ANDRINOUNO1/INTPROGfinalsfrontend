import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Workflow {
    id: number;
    employeeId: number;
    type: string;
    details: any;
    status: string;
}

@Injectable({
    providedIn: 'root'
})
export class WorkflowService {
    private baseUrl = '/workflows'; // Base URL for the fake backend

    constructor(private http: HttpClient) {}

    // Get workflows for a specific employee
    getWorkflowsByEmployeeId(employeeId: number): Observable<Workflow[]> {
        return this.http.get<Workflow[]>(`${this.baseUrl}/employee/${employeeId}`);
    }

    // Update the status of a workflow
    updateWorkflowStatus(workflowId: number, status: string): Observable<Workflow> {
        return this.http.put<Workflow>(`${this.baseUrl}/${workflowId}`, { status });
    }
}