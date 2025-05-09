import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService, Employee } from './employee.service';
import { DepartmentService, Department } from '../departments/department.service';

@Component({
    selector: 'app-transfer-employee',
    templateUrl: './transfer.component.html',
    standalone: false
})
export class TransferEmployeeComponent implements OnInit {
    employee?: Employee; // Employee being transferred
    departments: Department[] = []; // List of departments
    departmentId?: number; // Selected department ID
    errorMessage: string = '';

    constructor(
        private employeeService: EmployeeService,
        private departmentService: DepartmentService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        const employeeId = this.route.snapshot.params['id'];
        this.loadEmployee(employeeId);
        this.loadDepartments();
    }

    // Load employee details
    loadEmployee(employeeId: number): void {
        this.employeeService.getEmployeeById(employeeId).subscribe({
            next: (data) => {
                this.employee = data;
                this.departmentId = data.departmentId; // Pre-select the current department
            },
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

    // Transfer the employee to the selected department
    transfer(): void {
        if (this.employee && this.departmentId) {
            this.employeeService.transferEmployee(this.employee.id, this.departmentId).subscribe({
                next: (response) => {
                    console.log(response.message);
                    this.router.navigate(['/employees']); // Navigate back to the employee list
                },
                error: (err) => (this.errorMessage = 'Failed to transfer employee')
            });
        }
    }

    // Cancel and navigate back
    cancel(): void {
        this.router.navigate(['/employees']);
    }
}