import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface RequestItem {
    name: string;
    quantity: number;
}

export interface Request {
    id: number;
    employeeId: number;
    type: string;
    items: RequestItem[];
    status: string;
}

@Injectable({
    providedIn: 'root'
})
export class RequestService {
private baseUrl = `${environment.apiUrl}/requests`; // Base URL for the fake backend
    constructor(private http: HttpClient) {}

    // Get all requests
    getRequests(): Observable<Request[]> {
        return this.http.get<Request[]>(this.baseUrl);
    }

    // Get a single request by ID
    getRequestById(id: number): Observable<Request> {
        return this.http.get<Request>(`${this.baseUrl}/${id}`);
    }

    // Create a new request
    createRequest(request: Partial<Request>): Observable<Request> {
        return this.http.post<Request>(this.baseUrl, request);
    }

    // Update an existing request
    updateRequest(id: number, request: Partial<Request>): Observable<Request> {
        return this.http.put<Request>(`${this.baseUrl}/${id}`, request);
    }

    // Delete a request
    deleteRequest(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
    }
}