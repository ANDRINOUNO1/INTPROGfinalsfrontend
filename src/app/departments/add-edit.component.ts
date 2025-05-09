import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from './department.service';
import { Department } from './department';

@Component({
    selector: 'app-add-edit-department',
    templateUrl: './add-edit.component.html',
    standalone: false,
})
export class AddEditDepartmentComponent implements OnInit {
    id?: number; // ID of the department being edited
    department: Partial<Department> = {}; // Department data
    errorMessage: string = '';

    constructor(
        private departmentService: DepartmentService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];
        if (this.id) {
            this.loadDepartment();
        }
    }

    // Load department details if editing
    loadDepartment(): void {
        this.departmentService.getDepartmentById(this.id!).subscribe({
            next: (data) => (this.department = data),
            error: (err) => (this.errorMessage = 'Failed to load department')
        });
    }

    // Save department (create or update)
    save(): void {
        if (this.id) {
            // Update existing department
            this.departmentService.updateDepartment(this.id, this.department).subscribe({
                next: () => this.router.navigate(['/departments']),
                error: (err) => (this.errorMessage = 'Failed to update department')
            });
        } else {
            // Create new department
            this.departmentService.createDepartment(this.department).subscribe({
                next: () => this.router.navigate(['/departments']),
                error: (err) => (this.errorMessage = 'Failed to create department')
            });
        }
    }

    // Cancel and navigate back
    cancel(): void {
        this.router.navigate(['/departments']);
    }
}