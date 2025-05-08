import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Department {
  id?: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-add-edit-department',
  templateUrl: './add-edit.component.html'
})
export class AddEditComponent implements OnInit {
  department: Department = { name: '', description: '' };
  id?: number;
  errorMessage: string = '';

  private apiUrl = 'http://localhost:3000/departments'; // ✅ backend route
  private headers = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token') // ✅ send auth token
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.loadDepartment();
    }
  }

  loadDepartment(): void {
    this.http.get<Department>(`${this.apiUrl}/${this.id}`, { headers: this.headers })
      .subscribe({
        next: (data) => this.department = data,
        error: (err) => {
          console.error('Failed to load department:', err);
          this.errorMessage = 'Failed to load department.';
        }
      });
  }

  save(): void {
    if (!this.department.name) {
      this.errorMessage = 'Name is required.';
      return;
    }

    if (this.id) {
      // Update existing
      this.http.put(`${this.apiUrl}/${this.id}`, this.department, { headers: this.headers })
        .subscribe({
          next: () => {
            alert('Department updated successfully.');
            this.router.navigate(['/departments']);
          },
          error: (err) => {
            console.error('Update failed:', err);
            this.errorMessage = 'Update failed.';
          }
        });
    } else {
      // Create new
      this.http.post(this.apiUrl, this.department, { headers: this.headers })
        .subscribe({
          next: () => {
            alert('Department created successfully.');
            this.router.navigate(['/departments']);
          },
          error: (err) => {
            console.error('Create failed:', err);
            this.errorMessage = 'Create failed.';
          }
        });
    }
  }

  cancel(): void {
    this.router.navigate(['/departments']);
  }
}
