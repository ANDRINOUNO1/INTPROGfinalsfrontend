import { Component, OnInit } from '@angular/core';
import { EmployeeService, Employee } from './employee.service';

@Component({
    selector: 'app-employee-list',
    templateUrl: './list.component.html',
    standalone: false
})
export class EmployeeListComponent implements OnInit {
    employees: Employee[] = [];

    constructor(private employeeService: EmployeeService) {}

    ngOnInit(): void {
        this.loadEmployees();
    }

    // Load all employees
    loadEmployees(): void {
        this.employeeService.getEmployees().subscribe({
            next: (data) => {
                console.log('Fetched employees:', data); // Debug log
                this.employees = data;
            },
            error: (err) => console.error('Failed to load employees', err)
        });
    }

    // View requests for an employee
    viewRequests(employeeId: number): void {
        console.log(`View requests for employee ID: ${employeeId}`);
    }

    // View workflows for an employee
    viewWorkflows(employeeId: number): void {
        console.log(`View workflows for employee ID: ${employeeId}`);
    }

    // Transfer an employee
    transfer(employee: Employee): void {
        const newDepartmentId = 2; // Example department ID
        this.employeeService.transferEmployee(employee.id, newDepartmentId).subscribe({
            next: (response) => {
                console.log(response.message);
                this.loadEmployees(); // Reload employees after transfer
            },
            error: (err) => console.error('Failed to transfer employee', err)
        });
    }

    // Edit an employee
    edit(employeeId: number): void {
        console.log(`Edit employee ID: ${employeeId}`);
    }

    // Delete an employee
    delete(employeeId: number): void {
        this.employeeService.deleteEmployee(employeeId).subscribe({
            next: (response) => {
                console.log(response.message);
                this.loadEmployees(); // Reload employees after deletion
            },
            error: (err) => console.error('Failed to delete employee', err)
        });
    }
}