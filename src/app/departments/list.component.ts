import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DepartmentService, Department } from './department.service';

@Component({
    selector: 'app-department-list',
    templateUrl: './list.component.html',
    standalone: false
})
export class DepartmentListComponent implements OnInit {
    departments: Department[] = [];
    errorMessage: string = '';

    constructor(
        private departmentService: DepartmentService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadDepartments();
    }

    // Load all departments
    loadDepartments(): void {
        this.departmentService.getDepartments().subscribe({
            next: (data) => (this.departments = data),
            error: (err) => (this.errorMessage = 'Failed to load departments')
        });
    }

    // Navigate to the add department page
    add(): void {
        this.router.navigate(['/departments/add']);
    }

    // Navigate to the edit department page
    edit(departmentId: number): void {
        this.router.navigate(['/departments/edit', departmentId]);
    }

    // Delete a department
    delete(departmentId: number): void {
        if (confirm('Are you sure you want to delete this department?')) {
            this.departmentService.deleteDepartment(departmentId).subscribe({
                next: (response) => {
                    console.log(response.message);
                    this.loadDepartments(); // Reload departments after deletion
                },
                error: (err) => (this.errorMessage = 'Failed to delete department')
            });
        }
    }

    // Check the current user's role
    account(): { role: string } | null {
        // Simulate fetching the current user's account details
        return { role: 'Admin' }; // Replace with actual logic if needed
    }
}