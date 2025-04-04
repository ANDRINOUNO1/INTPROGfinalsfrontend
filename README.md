# Angular 10 Signup Verification Boilerplate

This Angular 10 Boilerplate provides a foundation for user authentication, including features such as email sign-up with verification, JWT authentication, role-based authorization, and password management.

---

## Features

- **Email Sign Up and Verification**: Users can register and verify their accounts via email.
- **JWT Authentication**: Utilizes JWT access tokens and refresh tokens for secure authentication.
- **Role-Based Authorization**: Supports two roles: User and Admin.
- **Forgot Password Functionality**: Users can reset their passwords.
- **Profile Management**: Users can view and update their profiles.
- **Admin Section**: Admins can manage user accounts.

---

## Prerequisites

Before setting up the project, ensure you have the following installed:

1. **Node.js**: [Download Node.js](https://nodejs.org/en/download/).
2. **MySQL**: Required if using a real backend.
3. **Angular CLI**: Install Angular CLI globally:
   ```bash
   npm install -g @angular/cli
   ```

---

## Installation

### Prerequisites
Ensure you have the following installed:
1. **Node.js**: [Download Node.js](https://nodejs.org/en/download/).
2. **Angular CLI**: Install Angular CLI globally:
   ```bash
   npm install -g @angular/cli
   ```

### Steps to Install
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install Dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Run the Application**:
   - For a fake backend:
     ```bash
     npm start
     ```
     **Reminder**: Remove the `//` in `app.module.ts` (line 34: `// fakeBackendProvider`) to enable the fake backend.
   - To switch to a real backend:
     1. Open `src/app/app.module.ts`.
     2. Remove or comment out the `fakeBackendProvider` line.

4. **Start the Development Server**:
   ```bash
   ng serve
   ```
   Access the application at [http://localhost:4200](http://localhost:4200).

---

## Usage Instructions

### User Registration
1. Navigate to [http://localhost:4200/register](http://localhost:4200/register).
2. Fill out the registration form with your email and password.
3. Click **Register**.
4. A simulated email verification message will appear with a verification link. Click the link to verify your account.

### Login
1. Navigate to [http://localhost:4200/login](http://localhost:4200/login).
2. Enter your registered email and password.
3. Click **Login** to access your account.

### Forgot Password
1. On the login page, click **Forgot Password**.
2. Enter your registered email address.
3. A simulated reset password email will appear with a link. Click the link to reset your password.

---

## Testing the Application

### Testing with Fake Backend
The application runs with a fake backend by default, simulating API responses for testing purposes.

1. Start the application:
   ```bash
   npm start
   ```
2. Access the application at [http://localhost:4200](http://localhost:4200).
3. Test features such as registration, login, forgot password, and profile management.

### Switching to a Real Backend
1. Ensure the backend server is running.
2. Open `src/app/app.module.ts` and remove or comment out the `fakeBackendProvider` line.
3. Update the API base URL in `src/environments/environment.ts` to point to the backend server.
4. Restart the application:
   ```bash
   ng serve
   ```

---

## Frontend Features

- **User Registration**: Create accounts with email verification.
- **Login/Logout**: Secure login and logout functionality.

---

## Team Assignments

- **Backend Developer (API)**: @Niel Ivan M. Eroy
- **Frontend Developer (Angular)**: @Rey Nino Perez
- **Tester (API and Frontend Testing)**: @Sean Ivan Ostra
- **Documentation Specialist (README.md)**: Jurace L. Lomutos
- **DevOps Lead (Repository Setup, Branch Management, CI/CD Pipeline if Applicable)**: @Andrew Czar S. Mata

---

## Collaborative Development of a Full-Stack Application

### Project: Hotel Management System

---
