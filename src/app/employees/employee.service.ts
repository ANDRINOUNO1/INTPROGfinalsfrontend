import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
    id: number;
    employeeId: string;
    userId: number;
    position: string;
    departmentId: number;
    hireDate: string;
    status: string;
}

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    private baseUrl = '/employees'; // Base URL for the fake backend

    constructor(private http: HttpClient) {}

    // Get all employees
    getEmployees(): Observable<Employee[]> {
        return this.http.get<Employee[]>(this.baseUrl);
    }

    // Get a single employee by ID
    getEmployeeById(id: number): Observable<Employee> {
        return this.http.get<Employee>(`${this.baseUrl}/${id}`);
    }

    // Create a new employee
    createEmployee(employee: Partial<Employee>): Observable<Employee> {
        return this.http.post<Employee>(this.baseUrl, employee);
    }

    // Update an existing employee
    updateEmployee(id: number, employee: Partial<Employee>): Observable<Employee> {
        return this.http.put<Employee>(`${this.baseUrl}/${id}`, employee);
    }

    // Delete an employee
    deleteEmployee(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
    }

    // Transfer an employee to a different department
    transferEmployee(id: number, departmentId: number): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${this.baseUrl}/${id}/transfer`, { departmentId });
    }
}