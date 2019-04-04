import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { MyDashboardComponent } from './my-dashboard/my-dashboard.component';
import { NavComponent } from './nav/nav.component';
import { ClaimsComponent } from './claims/claims.component';
import { MainComponent } from './main/main.component';
import { ClaimDetailsComponent, LinkedClaimDialogComponent, RaiseProcedureComponent } from './claim-details/claim-details.component';
import { AuthGuard } from './provider-auth-guard';
import { AuthService } from './provider-auth.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ClaimListComponent, RaiseClaimDialogComponent } from './claim-list/claim-list.component';
import { StartingPageComponent, AddServiceComponent, ServiceSuccess } from './starting-page/starting-page.component';
import { HealthCareEventComponent } from './health-care-event/health-care-event.component';
import { TabsModule } from 'ngx-bootstrap';
import { HealthCareEventDashboardComponent } from './health-care-event-dashboard/health-care-event-dashboard.component';
import { ErrorComponent as ErrorComponent2 } from './health-care-event/health-care-event.component';
import { HealthCareEventDetailsComponent, RaiseProceduresComponent, LinkedHCEDialogComponent, ErrorComponent } from './health-care-event-details/health-care-event-details.component';
import { AddPhysicianComponent, SuccessDialogComponent } from './add-physician/add-physician.component';

const providerRoutes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      { path: 'landingpage', component: StartingPageComponent, canActivate: [AuthGuard] },
      { path: 'dashboard', component: MyDashboardComponent, canActivate: [AuthGuard] },
      { path: 'claims', component: ClaimsComponent, canActivate: [AuthGuard] },
      { path: 'claim-details', component: ClaimDetailsComponent, canActivate: [AuthGuard] },
      { path: 'health-care-event', component: HealthCareEventComponent, canActivate: [AuthGuard] },
      { path: '', redirectTo: 'landingpage', pathMatch: 'full' },
      { path: 'add-physician', component: AddPhysicianComponent, canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSelectModule,
    TabsModule.forRoot(),
    RouterModule.forChild(providerRoutes)
  ],
  declarations: [
    MyDashboardComponent,
    NavComponent,
    ClaimsComponent,
    MainComponent,
    ClaimDetailsComponent,
    ClaimListComponent,
    RaiseClaimDialogComponent,
    LinkedClaimDialogComponent,
    RaiseProcedureComponent,
    StartingPageComponent,
    HealthCareEventComponent,
    HealthCareEventDashboardComponent,
    HealthCareEventDetailsComponent,
    LinkedHCEDialogComponent,
    ErrorComponent,
    ErrorComponent2,
    RaiseProceduresComponent,
    AddPhysicianComponent,
    AddServiceComponent,
    ServiceSuccess,
    SuccessDialogComponent,],
  entryComponents: [
    LinkedHCEDialogComponent,
    ErrorComponent,
    ErrorComponent2,
    AddServiceComponent,
    ServiceSuccess,
    RaiseProceduresComponent,
    LinkedClaimDialogComponent,
    RaiseProcedureComponent,
    SuccessDialogComponent
  ],
  providers: [
    AuthGuard,
    AuthService
  ]
})
export class ProviderModule { }
