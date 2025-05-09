import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DepartmentService } from './department.service';
import { Department } from './department';
import { EmployeeService } from '../employees/employee.service';
import { Employee } from '../employees/employee';

@Component({
    selector: 'app-department-list',
    templateUrl: './list.component.html',
    standalone: false
})
export class DepartmentListComponent implements OnInit {
    departments: Department[] = [];
    employees: Employee[] = [];
    errorMessage: string = '';

    constructor(
        private departmentService: DepartmentService,
        private router: Router,
        private employeeService: EmployeeService
    ) {}

    ngOnInit(): void {
        this.loadDepartments();
        this.loadEmployees();
    }

    // Load all departments
    loadDepartments(): void {
        this.departmentService.getDepartments().subscribe({
            next: (data) => (this.departments = data),
            error: (err) => (this.errorMessage = 'Failed to load departments')
        });
    }

    loadEmployees(): void {
        this.employeeService.getEmployees().subscribe({
            next: (data) => (this.employees = data),
            error: (err) => (this.errorMessage = 'Failed to load employees')
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

    // Get the count of employees in a department
    getEmployeeCount(departmentId: number): number {
        return this.employees.filter(e => e.departmentId === departmentId).length;
    }
}