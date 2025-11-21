import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  tips: string[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter username and password.';
      return;
    }

    if (!emailPattern.test(this.username)) {
      this.errorMessage = 'Please provide a correct email address.';
      return;
    }

    this.errorMessage = '';

    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        this.router.navigate(['/employee']);
      },
      error: (err) => {
        console.error('Login error:', err);
        if (err.status === 401) {
          this.errorMessage = 'Incorrect email or password.';
        } else if (err.error?.detail) {
          this.errorMessage = Array.isArray(err.error.detail)
            ? err.error.detail.map((d: any) => d.msg).join(', ')
            : err.error.detail;
        } else {
          this.errorMessage = 'Something went wrong. Please try again later.';
        }
      }
    });
  }
}
