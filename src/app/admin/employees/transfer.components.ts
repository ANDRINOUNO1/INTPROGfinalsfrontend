import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Department {
  id: number;
  name: string;
}

interface Employee {
  employeeId: number;
  name: string;
  departmentId: number;
}

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html'
})
export class TransferComponent implements OnInit {
  @Input() employee!: Employee;
  departments: Department[] = [];
  departmentId?: number;
  errorMessage: string = '';

  private apiUrl = 'http://localhost:3000'; // adjust base URL if needed

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.departmentId = this.employee.departmentId; // preselect current department
  }

  loadDepartments(): void {
    this.http.get<Department[]>(`${this.apiUrl}/departments`)
      .subscribe({
        next: (data) => this.departments = data,
        error: (err) => {
          console.error('Failed to load departments:', err);
          this.errorMessage = 'Failed to load departments.';
        }
      });
  }

  transfer(): void {
    if (!this.departmentId) {
      this.errorMessage = 'Please select a department.';
      return;
    }

    const transferData = { departmentId: this.departmentId };

    // ✅ backend uses POST /employees/:id for transfer
    this.http.post(`${this.apiUrl}/employees/${this.employee.employeeId}`, transferData)
      .subscribe({
        next: () => {
          alert('Employee transferred successfully.');
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          console.error('Transfer failed:', err);
          this.errorMessage = 'Transfer failed.';
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }
}
