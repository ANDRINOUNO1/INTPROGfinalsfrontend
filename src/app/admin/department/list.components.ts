import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

interface Department {
  id: string;
  name: string;
  description: string;
  employeeCount: number;
}

@Component({
  selector: 'app-department-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  departments: Department[] = [];
  apiUrl = 'http://localhost:3000/departments'; // update if your API base URL is different
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    const headers = this.buildAuthHeaders();
    this.http.get<Department[]>(this.apiUrl, { headers }).subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: (err) => {
        console.error('Error loading departments:', err);
        this.errorMessage = 'Failed to load departments.';
      }
    });
  }

  add(): void {
    this.router.navigate(['/departments/add']);
  }

  edit(id: string): void {
    this.router.navigate(['/departments/edit', id]);
  }

  delete(id: string): void {
    if (confirm('Are you sure you want to delete this department?')) {
      const headers = this.buildAuthHeaders();
      this.http.delete(`${this.apiUrl}/${id}`, { headers }).subscribe({
        next: () => {
          this.departments = this.departments.filter(d => d.id !== id);
          alert('Department deleted successfully.');
        },
        error: (err) => {
          console.error('Error deleting department:', err);
          alert('Failed to delete department.');
        }
      });
    }
  }

  account(): any {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  }

  private buildAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}
