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
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.errorMessage = '';

    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        // Optional welcome tip
        this.tips.push(`Welcome, ${res.employee_full_name}!`);
        this.router.navigate(['/employee']);
      },
      error: (err) => {
        console.error('Login error:', err);
        if (err.status === 401) {
          this.errorMessage = 'Invalid email or password.';
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
