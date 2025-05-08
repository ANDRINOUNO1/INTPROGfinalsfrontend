import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { mergeMap } from 'rxjs/operators';

import { AlertService } from '@app/_services';
import { Role } from '@app/_models';


const accountsKey = 'angular-10-signup-verification-boilerplate-accounts';
localStorage.removeItem(accountsKey);
let accounts: any[] = [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    users: any;
    constructor(private alertService: AlertService) {
        // Removed invalid binding of this.employees
    }

    public employees = [
        { id: 1, employeeId: 'EMP001', userId: 1, position: 'Developer', departmentId: 1, hireDate: '2025-01-01', status: 'Active' },
        { id: 2, employeeId: 'EMP002', userId: 2, position: 'Designer', departmentId: 2, hireDate: '2025-02-01', status: 'Active' }
    ];

    public departments = [
        { id: 1, name: 'Engineering', description: 'Software development team', employeeCount: 1 },
        { id: 2, name: 'Marketing', description: 'Marketing team', employeeCount: 1 }
    ];

    public workflows = [
        { id: 1, employeeId: 1, type: 'Onboarding', details: { task: 'Setup workstation' }, status: 'Pending' }
    ];

    public requests = [
        { id: 1, employeeId: 2, type: 'Equipment', requestItems: [{ name: 'Laptop', quantity: 1 }], status: 'Pending' }
    ];

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;
        const alertService = this.alertService;
    
        return handleRoute().pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse && error.status === 400) {
                    // Show the error alert if status is 400
                    alertService.error(error.error.message);
                }
                return throwError(error);
            })
        );

        function handleRoute() {
            switch (true) {
                case url.endsWith('/accounts/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/accounts/refresh-token') && method === 'POST':
                    return refreshToken();
                case url.endsWith('/accounts/revoke-token') && method === 'POST':
                    return revokeToken();
                case url.endsWith('/accounts/register') && method === 'POST':
                    return register();
                case url.endsWith('/accounts/verify-email') && method === 'POST':
                    return verifyEmail();
                case url.endsWith('/accounts/forgot-password') && method === 'POST':
                    return forgotPassword();
                case url.endsWith('/accounts/validate-reset-token') && method === 'POST':
                    return validateResetToken();
                case url.endsWith('/accounts/reset-password') && method === 'POST':
                    return resetPassword();
                case url.endsWith('/accounts') && method === 'GET':
                    return getAccounts();
                case url.match(/\/accounts\/\d+$/) && method === 'GET':
                    return getAccountById();
                case url.endsWith('/accounts') && method === 'POST':
                    return createAccount();
                case url.match(/\/accounts\/\d+$/) && method === 'PUT':
                    return updateAccount();
                case url.match(/\/accounts\/\d+$/) && method === 'DELETE':
                    return deleteAccount();
                // Employees Routes
                case url.endsWith('/employees') && method === 'GET':
                    return getEmployees(headers);

                case url.endsWith('/employees') && method === 'POST':
                    return createEmployee(body, headers);

                case url.match(/\/employees\/\d+$/) && method === 'GET':
                    return getEmployeeById(url, headers);

                case url.match(/\/employees\/\d+$/) && method === 'PUT':
                    return updateEmployee(url, body, headers);

                case url.match(/\/employees\/\d+$/) && method === 'DELETE':
                    return deleteEmployee(url, headers);

                case url.match(/\/employees\/\d+\/transfer$/) && method === 'POST':
                    return transferEmployee(url, body);

                // Departments Routes
                case url.endsWith('/departments') && method === 'GET':
                    return getDepartments(headers);

                case url.endsWith('/departments') && method === 'POST':
                    return createDepartment(body, headers);

                case url.match(/\/departments\/\d+$/) && method === 'PUT':
                    return updateDepartment(url, body, headers);

                case url.match(/\/departments\/\d+$/) && method === 'DELETE':
                    return deleteDepartment(url, headers);

                // Workflows Routes
                case url.match(/\/workflows\/employee\/\d+$/) && method === 'GET':
                    return getWorkflowsByEmployeeId(url, headers);

                case url.endsWith('/workflows') && method === 'GET':
                    return getWorkflows(headers);

                case url.endsWith('/workflows') && method === 'POST':
                    return createWorkflow(body, headers);

                case url.match(/\/workflows\/\d+$/) && method === 'DELETE':
                    return deleteWorkflow(url, headers);

                // Requests Routes
                case url.endsWith('/requests') && method === 'GET':
                    return getRequests(headers);

                case url.endsWith('/requests') && method === 'POST':
                    return createRequest(body, headers);

                case url.match(/\/requests\/\d+$/) && method === 'PUT':
                    return updateRequest(url, body, headers);

                case url.match(/\/requests\/\d+$/) && method === 'DELETE':
                    return deleteRequest(url, headers);
                        default:
                            return next.handle(request);
                    }
        }

        // ===== ROUTE FUNCTIONS =====

        function authenticate() {
            const { email, password } = body;
            const account = accounts.find(x => x.email === email);
        
            if (!account) {
                return error('Invalid email.'); 
            }
        
            if (account.password !== password) {
                return error('Password is incorrect'); 
            }
        
            if (!account.isVerified) {
                return error('Email is not verified. Please check your inbox to verify.');
            }
        
            if (account.status !== 'Active') {
                return error('Account is InActive. Please contact system administrator!');
            }
        
            account.refreshTokens.push(generateRefreshToken());
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
        
            return ok({
                ...basicDetails(account),
                jwtToken: generateJwtToken(account)
            });
        }
        
        

        function refreshToken() {
            const refreshToken = getRefreshToken();
            if (!refreshToken) return unauthorized();

            const account = accounts.find(x => x.refreshTokens.includes(refreshToken));
            if (!account) return unauthorized();

            account.refreshTokens = account.refreshTokens.filter(x => x !== refreshToken);
            account.refreshTokens.push(generateRefreshToken());
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok({
                ...basicDetails(account),
                jwtToken: generateJwtToken(account)
            });
        }

        function revokeToken() {
            if (!isAuthenticated()) return unauthorized();
            const refreshToken = getRefreshToken();
            const account = accounts.find(x => x.refreshTokens.includes(refreshToken));
            account.refreshTokens = account.refreshTokens.filter(x => x !== refreshToken);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            return ok();
        }

        function register() {
            const account = body;
            account.status = 'Active';
            if (accounts.find(x => x.email === account.email)) {
                setTimeout(() => {
                    alertService.info(`
                        <h4>Email Already Registered</h4>
                        <p>Your email ${account.email} is already registered.</p>
                        <p>If you don't know your password please visit the <a href="${location.origin}/account/forgot-password">forgot password</a> page.</p>
                        <div><strong>NOTE:</strong> The fake backend displayed this "email" so you can test without an API. A real backend would send a real email.</div>
                    `, { autoClose: false });
                }, 1000);
                return ok();
            }

            account.id = newAccountId();
            account.role = account.id === 1 ? Role.Admin : Role.User;
            account.dateCreated = new Date().toISOString();
            account.refreshTokens = [];
            delete account.confirmPassword;

            if (account.role === Role.Admin) {
                account.isVerified = true;
            } else {
                account.verificationToken = new Date().getTime().toString();
                account.isVerified = false;

                setTimeout(() => {
                    const verifyUrl = `${location.origin}/account/verify-email?token=${account.verificationToken}`;
                    alertService.info(`
                        <h4>Verification Email</h4>
                        <p>Thanks for registering!</p>
                        <p>Please click the below link to verify your email address:</p>
                        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
                        <div><strong>NOTE:</strong> The fake backend displayed this "email" so you can test without an API.</div>
                    `, { autoClose: false });
                }, 1000);
            }

            accounts.push(account);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            return ok();
        }

        function verifyEmail() {
            const { token } = body;
            const account = accounts.find(x => x.verificationToken === token);
            if (!account) return error('Verification failed');
            account.isVerified = true;
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            return ok();
        }

        function forgotPassword() {
            const { email } = body;
            const account = accounts.find(x => x.email === email);
            if (!account) return ok();

            account.resetToken = new Date().getTime().toString();
            account.resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            setTimeout(() => {
                const resetUrl = `${location.origin}/account/reset-password?token=${account.resetToken}`;
                alertService.info(`
                    <h4>Reset Password Email</h4>
                    <p>Please click the below link to reset your password. It will be valid for 1 day:</p>
                    <p><a href="${resetUrl}">${resetUrl}</a></p>
                    <div><strong>NOTE:</strong> This fake backend displayed this "email" so you can test without an API.</div>
                `, { autoClose: false });
            }, 1000);

            return ok();
        }

        function validateResetToken() {
            const { token } = body;
            const account = accounts.find(x => x.resetToken === token && new Date() < new Date(x.resetTokenExpires));
            if (!account) return error('Invalid token');
            return ok();
        }

        function resetPassword() {
            const { token, password } = body;
            const account = accounts.find(x => x.resetToken === token && new Date() < new Date(x.resetTokenExpires));
            if (!account) return error('Invalid token');

            account.password = password;
            account.isVerified = true;
            delete account.resetToken;
            delete account.resetTokenExpires;
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            return ok();
        }

        function getAccounts() {
            if (!isAuthenticated()) return unauthorized();
            return ok(accounts.map(x => basicDetails(x)));
        }

        function getAccountById() {
            if (!isAuthenticated()) return unauthorized();
            const account = accounts.find(x => x.id === idFromUrl());
            if (account.id !== currentAccount().id && !isAuthorized(Role.Admin)) return unauthorized();
            return ok(basicDetails(account));
        }

        function createAccount() {
            if (!isAuthorized(Role.Admin)) return unauthorized();

            const account = body;
            if (accounts.find(x => x.email === account.email)) return error(`Email ${account.email} is already registered`);

            account.id = newAccountId();
            account.dateCreated = new Date().toISOString();
            account.isVerified = true;
            account.status = 'Active';
            account.refreshTokens = [];
            delete account.confirmPassword;
            accounts.push(account);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            return ok();
        }

        function updateAccount() {
            if (!isAuthenticated()) return unauthorized();
            const params = body;
            const account = accounts.find(x => x.id === idFromUrl());
            if (account.id !== currentAccount().id && !isAuthorized(Role.Admin)) return unauthorized();

            if (!params.password) delete params.password;
            delete params.confirmPassword;

            Object.assign(account, params);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            return ok(basicDetails(account));
        }

        function deleteAccount() {
            if (!isAuthenticated()) return unauthorized();

            const id = idFromUrl();
            const account = accounts.find(x => x.id === id);
            if (account.id !== currentAccount().id && !isAuthorized(Role.Admin)) return unauthorized();

            const isDeletingAdmin = account.role === Role.Admin;
            accounts = accounts.filter(x => x.id !== id);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            if (isDeletingAdmin) {
                accounts = [];
                localStorage.setItem(accountsKey, JSON.stringify(accounts));
                setTimeout(() => location.reload(), 500);
            }

            return ok();
        }

        // ===== HELPER FUNCTIONS =====

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
        }

        function error(message: string) {
            return throwError(() => new HttpErrorResponse({ status: 400, error: { message } })).pipe(delay(500));
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }

        function newId(collection: any[]): number {
            return collection.length ? Math.max(...collection.map(x => x.id)) + 1 : 1;
        }
        function unauthorized() {
            return throwError(() => ({ status: 401, error: { message: 'Unauthorized' } })).pipe(materialize(), delay(500), dematerialize());
        }

        function basicDetails(account) {
            const { id, title, firstName, lastName, email, status, role, dateCreated, isVerified } = account;
            return { id, title, firstName, lastName, email, status, role, dateCreated, isVerified };
        }

        function basicEmployeeDetails(employee) {
            const { id, employeeId, userId, position, departmentId, hireDate, status } = employee;
            return { id, employeeId, userId, position, departmentId, hireDate, status };
        }

        function basicDepartmentDetails(department) {
            const { id, name, description, employeeCount } = department;
            return { id, name, description, employeeCount };
        }
        
        function basicWorkflowDetails(workflow) {
            const { id, employeeId, type, details, status } = workflow;
            return { id, employeeId, type, details, status };
        }
        
        function basicRequestDetails(request) {
            const { id, employeeId, type, requestItems, status } = request;
            return { id, employeeId, type, requestItems, status };
        }
        

        function isAuthenticated() {
            return !!currentAccount();
        }

        function isAuthorized(role) {
            const account = currentAccount();
            return account && account.role === role;
        }

        function newAccountId() {
            return accounts.length ? Math.max(...accounts.map(x => x.id)) + 1 : 1;
        }

        function currentAccount() {
            const authHeader = headers.get('Authorization');
            if (!authHeader?.startsWith('Bearer fake-jwt-token')) return;

            const token = authHeader.split('.')[1];
            const jwtToken = JSON.parse(atob(token));
            if (Date.now() > (jwtToken.exp * 1000)) return;

            return accounts.find(x => x.id === jwtToken.id);
        }

        function generateJwtToken(account) {
            const tokenPayload = {
                exp: Math.round(Date.now() / 1000) + 15 * 60,
                id: account.id
            };
            return `fake-jwt-token.${btoa(JSON.stringify(tokenPayload))}`;
        }

        function generateRefreshToken() {
            const token = new Date().getTime().toString();
            const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
            document.cookie = `fakeRefreshToken=${token}; expires=${expires}; path=/`;
            return token;
        }

        function getRefreshToken() {
            return (document.cookie.split(';').find(x => x.includes('fakeRefreshToken')) || '=').split('=')[1];
        }
        
        // Employee Handlers
        function getEmployees(headers: any) {
            return this.authorize(headers, null, () => {
                const employeesWithDetails = this.employees.map(employee => ({
                    ...employee,
                    user: this.users.find(u => u.id === employee.userId), // Add user details
                    department: this.departments.find(d => d.id === employee.departmentId) // Add department details
                }));
                return ok(employeesWithDetails);
            });
        }

        function createEmployee(body: any, headers: any) {
            return this.authorize(headers, 'Admin', () => {
                const employee = { id: newId(this.employees), ...body };
                this.employees.push(employee);
                return ok(employee);
            });
        }

        function getEmployeeById(url: string, headers: any) {
            return this.authorize(headers, null, () => {
                const employee = this.employees.find(e => e.id === idFromUrl());
                return employee ? ok(basicEmployeeDetails(employee)) : error('Employee not found');
            });
        }

        function updateEmployee(url: string, body: any, headers: any) {
            return this.authorize(headers, 'Admin', () => {
                const employee = this.employees.find(e => e.id === idFromUrl());
                if (!employee) return error('Employee not found');
                Object.assign(employee, body);
                return ok(basicEmployeeDetails(employee));
            });
        }

        function deleteEmployee(url: string, headers: any) {
            return this.authorize(headers, 'Admin', () => {
                this.employees = this.employees.filter(e => e.id !== idFromUrl());
                return ok({ message: 'Employee deleted' });
            });
        }

        function transferEmployee(url: string, body: any) {
            const transferId = idFromUrl();
            const transferBody = body;
            const employeeToTransfer = this.employees.find(e => e.id === transferId);
            if (employeeToTransfer) {
                employeeToTransfer.departmentId = transferBody.departmentId;
                return of(new HttpResponse({ status: 200, body: { message: 'Employee transferred successfully' } }));
            } else {
                return throwError(() => new Error('Employee not found'));
            }
        }
        
        // Department Handlers
        function getDepartments(headers: any) {
            return this.authorize(headers, null, () => ok(this.departments.map(basicDepartmentDetails)));
        }
        
        function createDepartment(body: any, headers: any) {
            return this.authorize(headers, 'Admin', () => {
                const department = { id: newId(this.departments), ...body, employeeCount: 0 };
                this.departments.push(department);
                return ok(department);
            });
        }
        
        function updateDepartment(url: string, body: any, headers: any) {
            return this.authorize(headers, 'Admin', () => {
                const department = this.departments.find(d => d.id === idFromUrl());
                if (!department) return error('Department not found');
                Object.assign(department, body);
                return ok(basicDepartmentDetails(department));
            });
        }
        
        function deleteDepartment(url: string, headers: any) {
            return this.authorize(headers, 'Admin', () => {
                this.departments = this.departments.filter(d => d.id !== idFromUrl());
                return ok({ message: 'Department deleted' });
            });
        }
        
        // Workflow Handlers
        function getWorkflows(headers: any) {
            return this.authorize(headers, null, () => {
                const workflowsWithDetails = this.workflows.map(workflow => ({
                    ...workflow,
                    employee: this.employees.find(e => e.id === workflow.employeeId) // Add employee details
                }));
                return ok(workflowsWithDetails);
            });
        }

        function createWorkflow(body: any, headers: any) {
            return this.authorize(headers, 'Admin', () => {
                const workflow = { id: newId(this.workflows), ...body };
                this.workflows.push(workflow);
                return ok(workflow);
            });
        }

        function deleteWorkflow(url: string, headers: any) {
            return this.authorize(headers, 'Admin', () => {
                this.workflows = this.workflows.filter(w => w.id !== idFromUrl());
                return ok({ message: 'Workflow deleted' });
            });
        }

        function getWorkflowsByEmployeeId(url: string, headers: any) {
            return this.authorize(headers, null, () => {
                const employeeId = idFromUrl();
                const workflows = this.workflows.filter(w => w.employeeId === employeeId).map(basicWorkflowDetails);
                return ok(workflows);
            });
        }

        // Request Handlers
        function getRequests(headers: any) {
            return this.authorize(headers, null, () => {
                const requestsWithDetails = this.requests.map(request => ({
                    ...request,
                    employee: this.employees.find(e => e.id === request.employeeId) // Add employee details
                }));
                return ok(requestsWithDetails);
            });
        }

        function createRequest(body: any, headers: any) {
            return this.authorize(headers, null, () => {
                const request = { id: newId(this.requests), ...body };
                this.requests.push(request);
                return ok(request);
            });
        }

        function updateRequest(url: string, body: any, headers: any) {
            return this.authorize(headers, 'Admin', () => {
                const request = this.requests.find(r => r.id === idFromUrl());
                if (!request) return error('Request not found');
                Object.assign(request, body);
                return ok(basicRequestDetails(request));
            });
        }

        function deleteRequest(url: string, headers: any) {
            return this.authorize(headers, 'Admin', () => {
                this.requests = this.requests.filter(r => r.id !== idFromUrl());
                return ok({ message: 'Request deleted' });
            });
        }
    }
}

export const fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    //useClass: FakeBackendInterceptor,
    multi: true
};
