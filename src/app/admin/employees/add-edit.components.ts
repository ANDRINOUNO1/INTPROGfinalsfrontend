import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-employee-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent implements OnInit {
  id: string | null = null;
  isEditMode = false;
  employee: any = {
    user: { email: '' },
    position: '',
    departmentId: '',
    hireDate: '',
    status: 'Active'
  };
  errorMessage = '';
  apiUrl = 'http://localhost:3000/employees'; // adjust if backend is deployed elsewhere

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEditMode = true;
      this.loadEmployee(this.id);
    }
  }

  loadEmployee(id: string): void {
    const headers = this.getAuthHeaders();
    this.http.get<any>(`${this.apiUrl}/${id}`, { headers }).subscribe({
      next: (data) => {
        this.employee = data;
      },
      error: (err) => {
        console.error('Error loading employee:', err);
        this.errorMessage = 'Failed to load employee data.';
      }
    });
  }

  save(): void {
    const headers = this.getAuthHeaders();
    if (this.isEditMode) {
      // UPDATE
      this.http.put(`${this.apiUrl}/${this.id}`, this.employee, { headers }).subscribe({
        next: () => {
          alert('Employee updated successfully');
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          console.error('Error updating employee:', err);
          this.errorMessage = 'Failed to update employee.';
        }
      });
    } else {
      // CREATE
      this.http.post(this.apiUrl, this.employee, { headers }).subscribe({
        next: () => {
          alert('Employee created successfully');
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          console.error('Error creating employee:', err);
          this.errorMessage = 'Failed to create employee.';
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }

  transfer(newDepartmentId: string): void {
    if (!this.id) {
      alert('Cannot transfer a non-existing employee.');
      return;
    }
    const headers = this.getAuthHeaders();
    const body = { departmentId: newDepartmentId };
    this.http.post(`${this.apiUrl}/${this.id}`, body, { headers }).subscribe({
      next: () => {
        alert('Employee transferred successfully');
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        console.error('Error transferring employee:', err);
        this.errorMessage = 'Failed to transfer employee.';
      }
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // assumes JWT stored in localStorage
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}
