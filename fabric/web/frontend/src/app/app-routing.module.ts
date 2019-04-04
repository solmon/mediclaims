import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PagenotfoundComponent } from './home/pagenotfound/pagenotfound.component';
import { MainComponent } from './home/main/main.component';
import { WelcomeComponent } from './home/welcome/welcome.component';
const appRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'welcome', component: WelcomeComponent },
      // {
      //   path: 'signin',
      //   loadChildren: './user/user.module#UserModule'
      // },
      {
        path: 'login',
        loadChildren: './user/user.module#UserModule'
      },
      {
        path: 'insurance',
        loadChildren: './insurance/insurance.module#InsuranceModule'
      },
      {
        path: 'provider',
        loadChildren: './provider/provider.module#ProviderModule'
      },
      {
        path: 'customer',
        loadChildren: './customer/customer.module#CustomerModule'
      },
      {
        path: 'blocks',
        loadChildren: './blocks/blocks.module#BlocksModule'
      },
      { path: '', redirectTo: 'customer', pathMatch: 'full' }
    ]
  },
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(appRoutes, { enableTracing: false })],
  declarations: []
})
export class AppRoutingModule { }
