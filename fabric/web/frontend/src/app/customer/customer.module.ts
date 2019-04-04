import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { CustomerDashboardComponent, DashErrorComponent } from './customer-dashboard/customer-dashboard.component';
import { ValidateUserComponent } from './validate-user/validate-user.component';
import { AuthGuard } from './customer-auth-guard';
import { AuthService } from './customer-auth.service';
import { PlanComponent } from './plan/plan.component';
import { MainComponent } from './main/main.component';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlanListComponent, LinkedPlanDialogComponent } from './plan-list/plan-list.component';
import { ActivePlanComponent } from './active-plan/active-plan.component';
import { ClaimDetailComponent } from './claim-detail/claim-detail.component';
import { PlanService } from '../service/plan.service';
const customerRoutes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      { path: '', component: ValidateUserComponent, canActivate: [AuthGuard] },
      { path: 'dashboard', component: CustomerDashboardComponent, canActivate: [AuthGuard] },
      { path: 'plan', component: PlanComponent, canActivate: [AuthGuard] },
      { path: 'activeplan', component: ActivePlanComponent, canActivate: [AuthGuard] },
      { path: 'claimdetail', component: ClaimDetailComponent, canActivate: [AuthGuard] },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule,
    RouterModule.forChild(customerRoutes)
  ],
  declarations: [
    ValidateUserComponent,
    CustomerDashboardComponent,
    PlanComponent,
    MainComponent,
    PlanListComponent,
    LinkedPlanDialogComponent,
    ActivePlanComponent,
    DashErrorComponent, 
    ClaimDetailComponent],
  entryComponents: [
    LinkedPlanDialogComponent,
    DashErrorComponent, 
  ],
  providers: [
    AuthGuard,
    AuthService,
    PlanService
  ]
})
export class CustomerModule { }
