import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { EmployeeLeaveComponent } from './pages/employee-leave/employee-leave.component';
import { AuthGaurdService } from './service/auth-gaurd.service';
import { AdminComponent } from './pages/admin/admin.component';
import { LeavedetailsComponent } from './pages/leavedetails/leavedetails.component';
import { HomeLayoutComponent } from './layouts/home-layout.component';
import { ManageleaveComponent } from './pages/manageleave/manageleave.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginLayoutComponent } from './layouts/login-layout.component';
// import { ApproverComponent } from './pages/approver/approver.component';


// const routes: Routes = [
//   { path: '', redirectTo: 'login', pathMatch: 'prefix',canActivate:[AuthGaurdService] },
//   { path: 'login', component: LoginComponent },
//   { path: 'employeeLeave', component: EmployeeLeaveComponent,canActivate:[AuthGaurdService] },
//   { path: 'manage', component: LeavedetailsComponent,canActivate:[AuthGaurdService] },
//   { path: 'admin', component: AdminComponent,canActivate:[AuthGaurdService] },
// ];

const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    canActivate: [AuthGaurdService],
    children: [
      // {
      //   path: '',component: HomeComponent
      // }
      { path: 'employeeLeave', component: EmployeeLeaveComponent  },
        { path: 'manage', component: ManageleaveComponent  },
        { path: 'admin', component: AdminComponent  },
        { path: 'norole', component: LeavedetailsComponent  },
        {
          path: 'register',
          component: RegisterComponent
        },
      
    ]
  },
  {
    path: '',
    component: LoginLayoutComponent,
    children: [ 
      
      {
        path: 'login',
        component: LoginComponent
      }
    ]
  },
  // { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
