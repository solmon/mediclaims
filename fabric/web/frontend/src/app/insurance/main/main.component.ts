import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  logout() {
    sessionStorage.setItem('insLoggedIn', 'false');
    sessionStorage.removeItem('insurance_user_id');
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/login/insurance']);
  }

}
