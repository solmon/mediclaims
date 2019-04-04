import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../customer/customer-auth.service';
import { Router } from '@angular/router';
// import { AuthService as oauthService } from 'angularx-social-login';
// import { SocialUser } from 'angularx-social-login';
import { CustomerService } from '../../service/customer.service';

@Component({
  selector: 'validate-user',
  templateUrl: './validate-user.component.html',
  styleUrls: ['./validate-user.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ValidateUserComponent implements OnInit {
  private loggedIn: boolean;

  constructor(private router: Router, private _customerservice: CustomerService, private _authService: AuthService) { }
  ngOnInit() {
    const userObj = {
      'customer': {
        'googleUID': sessionStorage.getItem('google_uid'),
      }
    };
    this._customerservice.getUser(userObj).subscribe((data) => {
      if (data.customerInfo != null && data.customerInfo.memberUid != null) {
        this.router.navigate(['/customer/dashboard']);
      } else {
        this.authenticate(sessionStorage.getItem('user_email'));
      }
    });
  }
  authenticate(email: string) {
    const userObj = {
      'customer': {
        'googleUID': sessionStorage.getItem('google_uid'),
        'email': email
      }
    };
    this._customerservice.authenticateUser(userObj).subscribe((data) => {
      if (data.success === true) {
        console.log("AUTHENTICATED : " + data);
        this.router.navigate(['/customer/dashboard']);
      }
    });
  }

  register(ssn: string, empId, dob) {
    const userObj = {
      'customer': {
        employeeID: empId,
        ssn: ssn,
        dob: dob
      }
    };
    this._customerservice.findUser(userObj).subscribe((data) => {
      if (data.memberUID != null) {
        console.log("REGISTERED : " + data.memberUID);
        const userObj = {
          'customer': {
            memberUID: data.memberUID,
            googleUID: sessionStorage.getItem('google_uid')
          }
        };
        this._customerservice.linkUser(userObj).subscribe((data) => {
          console.log(data);
          if (data.responseLinking === true) {
            this.router.navigate(['/customer/dashboard']);
            sessionStorage.setItem("member_uid",userObj.customer.memberUID);
          } else {
            sessionStorage.setItem('isLoggedIn', 'false');
            sessionStorage.removeItem('user_name');
            sessionStorage.removeItem('user_email');
            this.router.navigate(['/login/customer']);
          }
        });
      } else {
        sessionStorage.setItem('isLoggedIn', 'false');
        sessionStorage.removeItem('user_name');
        sessionStorage.removeItem('user_email');
        this.router.navigate(['/login/customer']);
      }
    });
  }

}
