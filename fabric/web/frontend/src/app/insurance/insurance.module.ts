import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MyDashboardComponent, LinkedClaimDialogComponent } from './my-dashboard/my-dashboard.component';
import { AuthGuard } from './insurance-auth-guard';
import { AuthService } from './insurance-auth.service';
import { MainComponent } from './main/main.component';
import { InsuranceServiceService } from './service/insurance-service.service';
import { ClaimsDetailsComponent } from './claims-details/claims-details.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { StartingPageComponent, AddRuleComponent, SuccessComponent, TrusteeComponent } from './starting-page/starting-page.component';

import { TabsModule } from 'ngx-bootstrap';
import {MatSelectModule} from '@angular/material/select';
import { AddMemberComponent, SuccessDialogComponent} from './add-member/add-member.component';
import { AddPlanAndEnrolmentComponent, AddBenefitDialogComponent, PlanList, EnrollDialogComponent,DashErrorComponent} from './add-plan-and-enrolment/add-plan-and-enrolment.component';

const insuranceRoutes: Routes = [
  { path: '', component: MainComponent,
  children: [
    {path: 'landingpage', component: StartingPageComponent, canActivate: [AuthGuard]},
    { path: 'dashboard', component: MyDashboardComponent, canActivate: [AuthGuard] },
    { path: 'addplanandenrolment/:id', component: AddPlanAndEnrolmentComponent, canActivate: [AuthGuard] },
    { path: 'claims-details', component: ClaimsDetailsComponent, canActivate: [AuthGuard] },
    { path: 'addmember', component: AddMemberComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: 'landingpage', pathMatch: 'full' }
  ]

  }];

@NgModule({
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSelectModule,
    TabsModule.forRoot(),
    RouterModule.forChild(insuranceRoutes)
  ],
  declarations: [MyDashboardComponent,DashErrorComponent, TrusteeComponent,MainComponent, ClaimsDetailsComponent, AddRuleComponent, LinkedClaimDialogComponent, StartingPageComponent, AddPlanAndEnrolmentComponent, AddBenefitDialogComponent,AddMemberComponent, SuccessDialogComponent, PlanList, EnrollDialogComponent, SuccessComponent],
  entryComponents: [
    SuccessComponent,
    EnrollDialogComponent,
    SuccessDialogComponent,
    AddRuleComponent,
    TrusteeComponent,
    LinkedClaimDialogComponent,
    AddBenefitDialogComponent,
    DashErrorComponent
  ],
  providers: [
    AuthGuard,
    AuthService,
    InsuranceServiceService
  ],
})
export class InsuranceModule { }

