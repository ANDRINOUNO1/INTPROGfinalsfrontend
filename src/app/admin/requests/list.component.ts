import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService, Request } from './request.service';

@Component({
    selector: 'app-request-list',
    templateUrl: './list.component.html',
    standalone: false,
})
export class RequestListComponent implements OnInit {
    requests: Request[] = [];
    errorMessage: string = '';

    constructor(
        private requestService: RequestService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadRequests();
    }

    // Load all requests
    loadRequests(): void {
        this.requestService.getRequests().subscribe({
            next: (data) => (this.requests = data),
            error: (err) => (this.errorMessage = 'Failed to load requests')
        });
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