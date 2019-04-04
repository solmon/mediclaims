import { Component, OnInit, Input, OnChanges, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AuthService as oauthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { Router } from '@angular/router';
import { PlanService } from '../../service/plan.service';

@Component({
  selector: 'app-linked-plan-dialog',
  templateUrl: 'linked-plan-dialog.html',
  styleUrls: ['./plan-list.component.css']
})
export class LinkedPlanDialogComponent {
  constructor(private _dialogRef: MatDialogRef<PlanListComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private _router: Router) { }
  activePlan() {
    console.log(this.data);
    this._dialogRef.close();
    this._router.navigate(['/customer/activeplan']);
  }
}
@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrls: ['./plan-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PlanListComponent implements OnInit, OnChanges {
  @Input() searchData: any;
  private user: SocialUser;
  dialogRef: any;
  constructor(public dialog: MatDialog, private oauth: oauthService, private _planservice: PlanService) { }
  ngOnInit() {
    this.oauth.authState.subscribe((user) => {
      this.user = user;
    });
  }
  ngOnChanges(): void {
    console.log(this.searchData);
  }
  linkToPlan(name: string, id: number, uuid: string, employeeId: string) {
    const linkObject = {
      userUid: this.user.id,
      corporateUserUuid: uuid,
      employeeId: employeeId
    };
    console.log(linkObject);
    this._planservice.linkPlan(linkObject).subscribe((data) => {
      if (data != null) {
        console.log(data);
        this.dialogRef = this.dialog.open(LinkedPlanDialogComponent, {
          disableClose: true,
          data: {
            name: name,
            id: id
          }
        });
      }
    });
  }
}

