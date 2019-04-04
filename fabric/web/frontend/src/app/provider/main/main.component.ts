import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../provider/provider-auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(public authservice: AuthService, private router: Router) { }

  ngOnInit() {
  }

  logout() {
    sessionStorage.setItem('providerLoggedIn', 'false');
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/login/provider']);
  }
   getName(){
    return sessionStorage.provider_name;
   }
}
