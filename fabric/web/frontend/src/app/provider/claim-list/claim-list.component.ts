import { Component, OnInit, Input, OnChanges, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AuthService as oauthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-raised-claim-dialog',
  templateUrl: 'raised-claim-dialog.html',
  styleUrls: ['./claim-list.component.css']
})
export class RaiseClaimDialogComponent {

  userName = sessionStorage.getItem('user_name');
  userEmail = sessionStorage.getItem('user_email');

  constructor(private _dialogRef: MatDialogRef<ClaimListComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private _router: Router) { }
  activePlan() {
    console.log(this.data);
    this._dialogRef.close();
    this._router.navigate(['/customer/activeplan']);
    console.log(this.userName);
  }
}
@Component({
  selector: 'app-claim-list',
  templateUrl: './claim-list.component.html',
  styleUrls: ['./claim-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ClaimListComponent implements OnInit, OnChanges {
  @Input() searchData: any;
  private user: SocialUser;
  dialogRef: any;
  claimObject: any = {};
  isgetData = false;
  constructor(public dialog: MatDialog, private oauth: oauthService) { }
  ngOnInit() {
    this.oauth.authState.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnChanges(): void {
  }
  raiseClaim(data) {
    this.claimObject = data;
    this.isgetData = true;
  }
}

