import { Component, OnInit } from '@angular/core';
import {
  Router,
  Event,
  NavigationStart,
  NavigationEnd,
  NavigationError,
  NavigationCancel
} from '@angular/router';
import { filter } from 'rxjs/operators';
import { PlanService } from '../../service/plan.service';
import { Observable } from 'rxjs';
import { ActivePlanDetails } from '../../domain/plan-details.module';
@Component({
  selector: 'app-claim-detail',
  templateUrl: './claim-detail.component.html',
  styleUrls: ['./claim-detail.component.css']
})
export class ClaimDetailComponent implements OnInit {
  claimData: ActivePlanDetails;
  constructor(public router: Router, private _planservice: PlanService) { }
  // Pie
  public pieChartLabels: string[] = ['Special Room', 'Pharmacy', 'Diaoganistic Service'];
  public pieChartData: number[] = [300, 500, 100];
  public pieChartType = 'pie';
  ngOnInit() {
    this._planservice.activePlanDetails(1).subscribe((data) => {
      this.claimData = data[0];
    });
    // this.router.events.pipe(
    //   filter((event: Event) => event instanceof NavigationEnd)
    // ).subscribe(x => {
    //     console.log('here');
    //     console.log(x);
    //   });
  }
  approveClaim(): void {
    this.router.navigate(['/provider']);
  }

}
