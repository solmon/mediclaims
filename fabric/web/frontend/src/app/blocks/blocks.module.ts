import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MyDashboardComponent } from './my-dashboard/my-dashboard.component';
import { MainComponent } from './main/main.component';
import { BlocksService } from './service/blocks-service.service';

import { TabsModule } from 'ngx-bootstrap';

const blocksRoutes: Routes = [
  { path: '', component: MainComponent,
  children: [
    { path: 'blocks', component: MyDashboardComponent },
    { path: '', redirectTo: 'blocks', pathMatch: 'full' }
  ]

}];

@NgModule({
  imports: [
    CommonModule,
    TabsModule.forRoot(),
    RouterModule.forChild(blocksRoutes)
  ],
  declarations: [MyDashboardComponent, MainComponent],
  providers: [
    BlocksService
  ]
})
export class BlocksModule { }

