import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {
  @Input() title: string = 'Delivery Tracker';
  userName: string = '';
  isLoggedIn: boolean = false;

  constructor(private router: Router) {
    this.checkLogin();
  }

  checkLogin() {
    const token = localStorage.getItem('auth_token');
    const name = localStorage.getItem('employee_name');
    this.isLoggedIn = !!token;
    this.userName = name || 'User';
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('employee_name');
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
