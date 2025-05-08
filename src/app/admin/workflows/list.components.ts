import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Workflow {
  id: number;
  type: string;
  details: any;
  status: string;
}

interface Account {
  role: string;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  @Input() employeeId!: number;
  workflows: Workflow[] = [];
  private _account: Account | null = null;
  private apiUrl = 'http://localhost:3000/workflows'; // replace with your actual API base URL

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Get current account (replace this with your actual auth service)
    this._account = { role: 'Admin' };

    this.loadWorkflows();
  }

  account(): Account | null {
    return this._account;
  }

  loadWorkflows(): void {
    this.http.get<Workflow[]>(`${this.apiUrl}/employee/${this.employeeId}`)
      .subscribe({
        next: (data) => this.workflows = data,
        error: (err) => console.error('Failed to load workflows:', err)
      });
  }

  updateStatus(workflow: Workflow): void {
    this.http.put(`${this.apiUrl}/${workflow.id}/status`, { status: workflow.status })
      .subscribe({
        next: (updatedWorkflow) => {
          console.log('Status updated successfully:', updatedWorkflow);
        },
        error: (err) => {
          console.error('Failed to update status:', err);
        }
      });
  }
}
