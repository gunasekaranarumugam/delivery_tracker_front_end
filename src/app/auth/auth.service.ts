import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


export interface LoginResponse {
  employee_id: string;
  employee_full_name: string;
  employee_email_address: string;
  access_token: string;
  business_unit_id?:string;
  business_unit_name?:string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://delivery-tracker-developmentalb-762815170.ap-south-1.elb.amazonaws.com/api/Employees';
  private tokenKey = 'auth_token';
  public isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}
  login(email: string, password: string): Observable<LoginResponse> {
  const body = new URLSearchParams();
  body.set('username', email);  // ⚠ FastAPI OAuth2 expects "username"
  body.set('password', password);

  return this.http.post<LoginResponse>(`${this.apiUrl}/login`, body.toString(), {
    headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
  }).pipe(
    tap(res => {
      // Log the full response and token for debugging

      console.log('Login response:', res);
      console.log('Token received:', res.access_token);

      // Store token and update login status
      if (res.access_token) {
        localStorage.setItem(this.tokenKey, res.access_token);
        localStorage.setItem('employee_name', res.employee_full_name);
        localStorage.setItem('employee_email', res.employee_email_address);
         if (res.business_unit_id) {
    localStorage.setItem('business_unit_id', res.business_unit_id);
  }
  if (res.business_unit_name) {
    localStorage.setItem('business_unit_name', res.business_unit_name);
  }
        this.isLoggedIn$.next(true);
      } else {
        console.warn('Login succeeded but no token returned');
      }
    }),
    catchError(err => {
      return throwError(() => err);
    })
  );
}



  logout(): void {
    const token = this.getToken();
    if (token) {
      this.http.post(`${this.apiUrl}/logout`, {}, {
        headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` })
      }).subscribe(() => {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem('employee_name');
        localStorage.removeItem('employee_email');
        this.isLoggedIn$.next(false);
      });
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getAuthenticatedUser(): {
    employee_full_name: string | null;
    employee_email: string | null;
    business_unit_id: string | null;
    business_unit_name: string | null;
    token: string | null;
  } {
    return {
      employee_full_name: localStorage.getItem('employee_name'),
      employee_email: localStorage.getItem('employee_email'),
      business_unit_id: localStorage.getItem('business_unit_id'),
      business_unit_name: localStorage.getItem('business_unit_name'),
      token: localStorage.getItem(this.tokenKey)
    };
  }
  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}
