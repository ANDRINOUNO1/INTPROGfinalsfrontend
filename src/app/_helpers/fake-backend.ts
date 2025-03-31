import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';
import { AlertService } from '@app/_services';
import { Role } from '@app/_models';

const accountsKey = 'angular-10-signup-verification-boilerplate-accounts';
let accounts = JSON.parse(localStorage.getItem(accountsKey)!) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    constructor(private alertService: AlertService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;
        return handleRoute();

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
                default:
                    return next.handle(request);
            }
        }

        function authenticate() {
            const { email, password } = body;
            const account = accounts.find(x => x.email === email && x.password === password && x.isVerified);
            if (!account) return error('Email or password is incorrect');
            account.refreshTokens.push(generateRefreshToken());
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            return ok({ ...basicDetails(account), jwtToken: generateJwtToken(account) });
        }

        function refreshToken() {
            const refreshToken = getRefreshToken();
            if (!refreshToken) return unauthorized();
            const account = accounts.find(x => x.refreshTokens.includes(refreshToken));
            if (!account) return unauthorized();
            account.refreshTokens = account.refreshTokens.filter(x => x !== refreshToken);
            account.refreshTokens.push(generateRefreshToken());
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            return ok({ ...basicDetails(account), jwtToken: generateJwtToken(account) });
        }

        function revokeToken() {
            if (!isAuthenticated()) return unauthorized();
            const refreshToken = getRefreshToken();
            const account = accounts.find(x => x.refreshTokens.includes(refreshToken));
            account.refreshTokens = account.refreshTokens.filter(x => x !== refreshToken);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            return ok();
        }

        function getRefreshToken() {
            const authHeader = headers.get('Authorization');
            if (!authHeader?.startsWith('Bearer fake-refresh-token')) return null;
            return authHeader.split(' ')[1];
        }

        function register() {
            const account = body;
            if (accounts.find(x => x.email === account.email)) {
                return error(`Email ${account.email} is already registered`);
            }
            account.id = newAccountId();
            account.role = accounts.length === 0 ? Role.Admin : Role.User;
            account.dateCreated = new Date().toISOString();
            account.verificationToken = new Date().getTime().toString();
            account.isVerified = false;
            account.refreshTokens = [];
            delete account.confirmPassword;
            accounts.push(account);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            return ok();
        }

        function ok(body?: any) {
            return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
        }

        function error(message: string) {
            return throwError(() => ({ error: { message } })).pipe(materialize(), delay(500), dematerialize());
        }

        function unauthorized() {
            return throwError(() => ({ status: 401, error: { message: 'Unauthorized' } })).pipe(materialize(), delay(500), dematerialize());
        }

        function basicDetails(account: any) {
            const { id, firstName, lastName, email, role, dateCreated, isVerified } = account;
            return { id, firstName, lastName, email, role, dateCreated, isVerified };
        }

        function isAuthenticated() {
            return !!currentAccount();
        }

        function newAccountId() {
            return accounts.length ? Math.max(...accounts.map(x => x.id)) + 1 : 1;
        }

        function currentAccount() {
            const authHeader = headers.get('Authorization');
            if (!authHeader?.startsWith('Bearer fake-jwt-token')) return;
            const jwtToken = JSON.parse(atob(authHeader.split('.')[1]));
            if (Date.now() > jwtToken.exp * 1000) return;
            return accounts.find(x => x.id === jwtToken.id);
        }

        function generateJwtToken(account: any) {
            const tokenPayload = { exp: Math.round((Date.now() + 15 * 60 * 1000) / 1000), id: account.id };
            return `fake-jwt-token.${btoa(JSON.stringify(tokenPayload))}`;
        }
    }
}

function generateRefreshToken() {
    const token = Math.random().toString(36).substring(2);
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // Set expiration to 7 days from now
    return { token, expires };
}

export let fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};

