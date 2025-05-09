import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from './request.service';
import { Request } from './request';

@Component({
    selector: 'app-add-edit-request',
    templateUrl: './add-edit.component.html',
    standalone: false,
})
export class AddEditRequestComponent implements OnInit {
    id?: number; // ID of the request being edited
    request: Partial<Request> = { items: [] }; // Request data
    errorMessage: string = '';

    constructor(
        private requestService: RequestService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];
        if (this.id) {
            this.loadRequest();
        }
    }

    // Load request details if editing
    loadRequest(): void {
        this.requestService.getRequestById(this.id!).subscribe({
            next: (data) => (this.request = data),
            error: (err) => (this.errorMessage = 'Failed to load request')
        });
    }

    // Save request (create or update)
    save(): void {
        if (this.id) {
            // Update existing request
            this.requestService.updateRequest(this.id, this.request).subscribe({
                next: () => this.router.navigate(['/requests']),
                error: (err) => (this.errorMessage = 'Failed to update request')
            });
        } else {
            // Create new request
            this.requestService.createRequest(this.request).subscribe({
                next: () => this.router.navigate(['/requests']),
                error: (err) => (this.errorMessage = 'Failed to create request')
            });
        }
    }

    // Add a new item to the request
    addItem(): void {
        this.request.items!.push({ name: '', quantity: 1 });
    }

    // Remove an item from the request
    removeItem(index: number): void {
        this.request.items!.splice(index, 1);
    }

    // Cancel and navigate back
    cancel(): void {
        this.router.navigate(['/requests']);
    }
}