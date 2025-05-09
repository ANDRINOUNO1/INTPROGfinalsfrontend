import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from './employee.service';
import { Employee } from './employee';
import { DepartmentService } from '../departments/department.service';
import { Department } from '../departments/department';
import { AccountService } from '../_services/account.service';
import { Account } from '../_models/account';

@Component({
    selector: 'app-employee-list',
    templateUrl: './list.component.html',
    standalone: false
})
export class EmployeeListComponent implements OnInit {
    employees: Employee[] = [];
    departments: Department[] = [];
    accounts: Account[] = [];
    showTransferModal = false;
    showDeleteModal = false;
    selectedEmployee: Employee | null = null;
    selectedDepartmentId: number | null = null;

    constructor(
        private employeeService: EmployeeService,
        private router: Router,
        private departmentService: DepartmentService,
        private accountService: AccountService
    ) {}

    ngOnInit(): void {
        this.loadEmployees();
        this.loadDepartments();
        this.loadAccounts();
    }

    loadDepartments(): void {
        this.departmentService.getDepartments().subscribe({
            next: (data) => (this.departments = data),
            error: (err) => console.error('Failed to load departments', err)
        });
    }

    loadAccounts(): void {
        this.accountService.getAll().subscribe({
            next: (data) => (this.accounts = data),
            error: (err) => console.error('Failed to load accounts', err)
        });
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
        this.router.navigate(['requests/employee', employeeId]);
    }

    // View workflows for an employee
    viewWorkflows(employeeId: number): void {
        this.router.navigate(['workflows/employee', employeeId]);
    }

    // Transfer an employee (open modal)
    transfer(employee: Employee): void {
        this.selectedEmployee = employee;
        this.selectedDepartmentId = employee.departmentId;
        this.showTransferModal = true;
    }

    confirmTransfer(): void {
        if (this.selectedEmployee && this.selectedDepartmentId) {
            this.employeeService.transferEmployee(this.selectedEmployee.id, this.selectedDepartmentId).subscribe({
                next: (response) => {
                    this.loadEmployees();
                    this.loadDepartments();
                    this.showTransferModal = false;
                },
                error: (err) => console.error('Failed to transfer employee', err)
            });
        }
    }

    cancelTransfer(): void {
        this.showTransferModal = false;
        this.selectedEmployee = null;
        this.selectedDepartmentId = null;
    }

    // Edit an employee
    edit(employeeId: number): void {
        this.router.navigate(['employees/edit', employeeId]);
    }

    // Delete an employee (open modal)
    delete(employeeId: number): void {
        const employee = this.employees.find(e => e.id === employeeId) || null;
        this.selectedEmployee = employee;
        this.showDeleteModal = true;
    }

    confirmDelete(): void {
        if (this.selectedEmployee) {
            this.employeeService.deleteEmployee(this.selectedEmployee.id).subscribe({
                next: (response) => {
                    this.loadEmployees();
                    this.loadDepartments();
                    this.showDeleteModal = false;
                },
                error: (err) => console.error('Failed to delete employee', err)
            });
        }
    }

    cancelDelete(): void {
        this.showDeleteModal = false;
        this.selectedEmployee = null;
    }

    // Add employee
    addEmployee(): void {
        this.router.navigate(['employees/add']);
    }

    // Get the count of employees in a department
    getDepartmentEmployeeCount(departmentId: number): number {
        const count = this.employees.filter(e => e.departmentId === departmentId).length;
        console.log('Department', departmentId, 'has', count, 'employees');
        return count;
    }

    // Get the status of the employee's account
    getAccountStatus(userId: number): string {
        const account = this.accounts.find(a => Number(a.id) === userId);
        console.log('Checking status for userId:', userId, '->', account ? account.status : 'Inactive');
        return account ? account.status : 'Inactive';
    }
}