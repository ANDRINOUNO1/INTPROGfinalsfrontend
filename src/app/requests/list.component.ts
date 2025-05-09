import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService } from './request.service';
import { Request } from './request';

@Component({
    selector: 'app-request-list',
    templateUrl: './list.component.html',
    standalone: false,
})
export class RequestListComponent implements OnInit {
    requests: Request[] = [];
    errorMessage: string = '';
    employeeId?: number;

    constructor(
        private requestService: RequestService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.employeeId = this.route.snapshot.params['id'];
        this.loadRequests();
    }

    // Load all requests or requests for a specific employee
    loadRequests(): void {
        if (this.employeeId) {
            this.requestService.getRequestsByEmployeeId(this.employeeId).subscribe({
                next: (data) => (this.requests = data),
                error: (err) => (this.errorMessage = 'Failed to load requests')
            });
        } else {
            this.requestService.getRequests().subscribe({
                next: (data) => (this.requests = data),
                error: (err) => (this.errorMessage = 'Failed to load requests')
            });
        }
    }

    // Navigate to the add request page
    add(): void {
        this.router.navigate(['/requests/add']);
    }

    // Navigate to the edit request page
    edit(requestId: number): void {
        this.router.navigate(['/requests/edit', requestId]);
    }

    // Delete a request
    delete(requestId: number): void {
        if (confirm('Are you sure you want to delete this request?')) {
            this.requestService.deleteRequest(requestId).subscribe({
                next: (response) => {
                    console.log(response.message);
                    this.loadRequests(); // Reload requests after deletion
                },
                error: (err) => (this.errorMessage = 'Failed to delete request')
            });
        }
    }

    // Check the current user's role
    account(): { role: string } | null {
        // Simulate fetching the current user's account details
        return { role: 'Admin' }; // Replace with actual logic if needed
    }
}