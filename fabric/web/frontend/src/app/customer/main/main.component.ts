import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../customer/customer-auth.service';
import { Router } from '@angular/router';
import { CustomerService } from '../../service/customer.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private router: Router, private _customerservice: CustomerService, private _authService: AuthService) { }

  ngOnInit() {
  }

  logout() {
    sessionStorage.setItem('isLoggedIn', 'false');
    sessionStorage.removeItem('user_name');
    sessionStorage.clear();
    this.router.navigate(['/login/customer']);
    localStorage.clear();
  }

}
