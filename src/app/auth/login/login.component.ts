import { Component } from '@angular/core';
import {AuthService} from "../auth.service";
import { Router} from "@angular/router";
import {PageHeaderComponent} from "../../page-header/page-header.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
   public username:string="";
   public password:string="";
   public errorMessage:string = '';
   constructor(private authService:AuthService,private router:Router) {
   }
   onSubmit() {
     this.authService.login(this.username, this.password).subscribe({
       next: (response) => {
         console.log('Login Response:', response);

         // Store token in localStorage
         localStorage.setItem('token', response.token);

         // Navigate to new page after successful login
         this.router.navigateByUrl('/bu');
       },
       error: (err) => {
         console.error('Login failed:', err);
         this.errorMessage = err.message;
       }
     });
   }
}
