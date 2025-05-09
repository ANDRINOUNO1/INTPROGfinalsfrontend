import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';
import { Role } from './_models';


const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: () => import('./account/account.module').then(x => x.AccountModule) },
    { path: 'profile', loadChildren: () => import('./profile/profile.module').then(x => x.ProfileModule), canActivate: [AuthGuard] },
    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(x => x.AdminModule), canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
    { path: 'departments', loadChildren: () => import('./admin/departments/department.module').then(m => m.DepartmentModule) },
    { path: 'employees', loadChildren: () => import('./admin/employees/employee.module').then(m => m.EmployeeModule) },
    { path: 'requests', loadChildren: () => import('./admin/requests/request.module').then(m => m.RequestsModule) },
    { path: 'workflows', loadChildren: () => import('./admin/workflows/workflow.module').then(m => m.WorkflowModule) },  
    // Otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
