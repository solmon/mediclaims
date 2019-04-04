import { Component, OnInit } from '@angular/core';
import {Router} from'@angular/router';
import { formatDate } from '@angular/common';
import { HealthCareEventService } from '../../service/health-care-event.service';

export class DummyHCE {
  date: string;
  patientID: string;
  patientName: string;
  insuranceID: string;
  insuranceProvider: string;
  coPay: string;
  totalFee: string;
  status: string;
}

export class DummyStatus {
  status: string;
  count: number;
}



@Component({
  selector: 'app-health-care-event-dashboard',
  templateUrl: './health-care-event-dashboard.component.html',
  styleUrls: ['./health-care-event-dashboard.component.css']
})
export class HealthCareEventDashboardComponent implements OnInit {

  constructor(private router: Router,public healthcareservice:HealthCareEventService) { }

  pending_hce = 0;
  today = new Date();
  jstoday = '';
  activePlans:any[];

  // dummyCards: DummyHCE[] = [
  //   {
  //     date: '02-04-2018', patientID: 'A234567',
  //     patientName: 'Mary C Nato', insuranceID: 'ZA7585768', insuranceProvider: 'Zigma Insurance',
  //     coPay: 'Yes', totalFee: '$2500.00', status: 'Approval Due'
  //   },
  //   {
  //     date: '02-04-2018', patientID: 'A999405',
  //     patientName: 'Mary C Nato', insuranceID: 'ZA7585768', insuranceProvider: 'Blue Cross Insurance',
  //     coPay: 'Yes', totalFee: '$5850.00', status: 'Approved'
  //   }
  // ];

  // dummyStatus: DummyStatus[] = [
  //   { status: 'Approved', count: 0 },
  //   { status: 'Active', count: 0 },
  //   { status: 'Rejected', count: 0 }
  // ];


  ngOnInit() {

    this.jstoday = formatDate(this.today, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530');
    // this.dummyStatus = [
    //   {
    //     status: 'Approved', count: 0
    //   },
    //   { status: 'Active', count: 0 },
    //   { status: 'Rejected', count: 0 }
    // ];
    // this.pending_hce = 0;
    this.healthcareservice.gethceList().subscribe((response)=>
  {
    console.log(response);
    this.activePlans=response;
  });
  }


  

}
