import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

interface Employee {
  id: string;
  employeeId: string;
  user?: { email: string };
  position: string;
  department?: { name: string };
  hireDate: string;
  status: string;
}

@Component({
  selector: 'app-employee-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  employees: Employee[] = [];
  apiUrl = 'http://localhost:3000/employees'; // Adjust to your API base URL
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    const headers = this.buildAuthHeaders();
    this.http.get<Employee[]>(this.apiUrl, { headers }).subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: (err) => {
        console.error('Error loading employees:', err);
        this.errorMessage = 'Failed to load employees.';
      }
    });
  }

  add(): void {
    this.router.navigate(['/employees/add']);
  }

  edit(id: string): void {
    this.router.navigate(['/employees/edit', id]);
  }

  delete(id: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      const headers = this.buildAuthHeaders();
      this.http.delete(`${this.apiUrl}/${id}`, { headers }).subscribe({
        next: () => {
          this.employees = this.employees.filter(emp => emp.id !== id);
          alert('Employee deleted successfully.');
        },
        error: (err) => {
          console.error('Error deleting employee:', err);
          alert('Failed to delete employee.');
        }
      });
    }
  }

  transfer(employee: Employee): void {
    this.router.navigate(['/employees/transfer', employee.id]);
  }

  viewRequests(id: string): void {
    this.router.navigate([`/employees/${id}/requests`]);
  }

  viewWorkflows(id: string): void {
    this.router.navigate([`/employees/${id}/workflows`]);
  }

  account(): any {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (e) {
      return null;
    }
  }

  private buildAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}
