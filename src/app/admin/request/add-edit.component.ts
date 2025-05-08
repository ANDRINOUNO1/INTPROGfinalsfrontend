import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

interface Department {
  id?: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-department-add-edit',
  templateUrl: './department-add-edit.component.html'
})
export class DepartmentAddEditComponent implements OnInit {
  department: Department = { name: '', description: '' };
  errorMessage: string = '';
  id?: number;
  private apiUrl = 'http://localhost:3000/departments'; // adjust base URL if needed

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.loadDepartment();
    }
  }

  loadDepartment(): void {
    this.http.get<Department>(`${this.apiUrl}/${this.id}`)
      .subscribe({
        next: (data) => this.department = data,
        error: (err) => {
          console.error('Failed to load department:', err);
          this.errorMessage = 'Failed to load department.';
        }
      });
  }

  save(): void {
    if (!this.department.name.trim()) {
      this.errorMessage = 'Department name is required.';
      return;
    }

    if (this.id) {
      // Update existing department
      this.http.put(`${this.apiUrl}/${this.id}`, this.department)
        .subscribe({
          next: () => this.router.navigate(['/departments']),
          error: (err) => {
            console.error('Failed to update department:', err);
            this.errorMessage = 'Failed to update department.';
          }
        });
    } else {
      // Create new department
      this.http.post(this.apiUrl, this.department)
        .subscribe({
          next: () => this.router.navigate(['/departments']),
          error: (err) => {
            console.error('Failed to create department:', err);
            this.errorMessage = 'Failed to create department.';
          }
        });
    }
  }

  cancel(): void {
    this.router.navigate(['/departments']);
  }
}
