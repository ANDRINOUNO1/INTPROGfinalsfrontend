import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService, Employee } from './employee.service';
import { DepartmentService, Department } from '../departments/department.service';

@Component({
    selector: 'app-add-edit-employee',
    templateUrl: './add-edit.component.html',
    standalone: false
})
export class AddEditEmployeeComponent implements OnInit {
    id?: number; // ID of the employee being edited
    employee: Partial<Employee> = {}; // Employee data
    departments: Department[] = []; // List of departments
    users: { id: number; email: string }[] = []; // List of users
    errorMessage: string = '';

    constructor(
        private employeeService: EmployeeService,
        private departmentService: DepartmentService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];
        this.loadDepartments();
        this.loadUsers();

        if (this.id) {
            this.loadEmployee();
        }
    }

    // Load employee details if editing
    loadEmployee(): void {
        this.employeeService.getEmployeeById(this.id!).subscribe({
            next: (data) => (this.employee = data),
            error: (err) => (this.errorMessage = 'Failed to load employee')
        });
    }

    // Load all departments
    loadDepartments(): void {
        this.departmentService.getDepartments().subscribe({
            next: (data) => (this.departments = data),
            error: (err) => (this.errorMessage = 'Failed to load departments')
        });
    }

    // Load all users
    loadUsers(): void {
        // Simulate fetching users from the fake backend
        this.users = [
            { id: 1, email: 'admin@example.com' },
            { id: 2, email: 'user@example.com' }
        ];
    }

    // Save employee (create or update)
    save(): void {
        if (this.id) {
            // Update existing employee
            this.employeeService.updateEmployee(this.id, this.employee).subscribe({
                next: () => this.router.navigate(['/employees']),
                error: (err) => (this.errorMessage = 'Failed to update employee')
            });
        } else {
            // Create new employee
            this.employeeService.createEmployee(this.employee).subscribe({
                next: () => this.router.navigate(['/employees']),
                error: (err) => (this.errorMessage = 'Failed to create employee')
            });
        }
    }

    // Cancel and navigate back
    cancel(): void {
        this.router.navigate(['/employees']);
    }
}