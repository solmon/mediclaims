import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PagenotfoundComponent } from './home/pagenotfound/pagenotfound.component';
import { MainComponent } from './home/main/main.component';
import { NavComponent } from './home/nav/nav.component';
import { WelcomeComponent } from './home/welcome/welcome.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard as CustomerAuthGuard } from './customer/customer-auth-guard';
import { AuthService as CustomerAuthService } from './customer/customer-auth.service';
import { PlanService } from './service/plan.service';
import { ClaimService } from './service/claim.service';
import { InsuranceService } from './service/insurance.service';
import { HealthCareEventService } from './service/health-care-event.service';

import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider } from 'angularx-social-login';
import { BlocksService } from './blocks/service/blocks-service.service';
import { UserModule } from './user/user.module';

export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
    [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('290416670476-cq75uk8nu94hpvljljg6muv65l2pdqb9.apps.googleusercontent.com')
      },
    ]
  );
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    PagenotfoundComponent,
    MainComponent,
    NavComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SocialLoginModule,
    UserModule
  ],
  providers: [CustomerAuthGuard, CustomerAuthService, PlanService, ClaimService, InsuranceService, HealthCareEventService, BlocksService, {
    provide: AuthServiceConfig,
    useFactory: getAuthServiceConfigs
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
