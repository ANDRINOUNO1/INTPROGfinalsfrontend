import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from './department';

@Injectable({
    providedIn: 'root'
})
export class DepartmentService {
    private baseUrl = 'http://localhost:4000/departments';

    constructor(private http: HttpClient) {}

    // Get all departments
    getDepartments(): Observable<Department[]> {
        return this.http.get<Department[]>(this.baseUrl);
    }

    // Get a single department by ID
    getDepartmentById(id: number): Observable<Department> {
        return this.http.get<Department>(`${this.baseUrl}/${id}`);
    }

    // Create a new department
    createDepartment(department: Partial<Department>): Observable<Department> {
        // Only send name and description
        const payload = {
            name: department.name,
            description: department.description
        };
        return this.http.post<Department>(this.baseUrl, payload);
    }

    // Update an existing department
    updateDepartment(id: number, department: Partial<Department>): Observable<Department> {
        return this.http.put<Department>(`${this.baseUrl}/${id}`, department);
    }

    // Delete a department
    deleteDepartment(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
    }
}