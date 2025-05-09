import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from './employee';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    private baseUrl = 'http://localhost:4000/employees';

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