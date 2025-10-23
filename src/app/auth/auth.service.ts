import { Injectable } from '@angular/core';
import {Observable, of, throwError} from "rxjs";
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router) { }
  login(username: string, password: string): Observable<any> {
    console.log("came");
    const mockUser = {
      username: 'admin',
      password: '12345',
      role:'admin'
    };

    const body = { username, password };
    if(username==mockUser.username && password==mockUser.password)
    {
      const response = {
        message: 'Login successful',
        user: {
          name: mockUser.username,
          role: mockUser.role
        }
      };
      return of({response})

    } else {
        return throwError(() => new Error('Invalid username or password'));
      }
    }
    // return this.http.post<any>(this.apiUrl, body);

}
