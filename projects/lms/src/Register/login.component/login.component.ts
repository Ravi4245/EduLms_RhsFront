import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LoginService,LoginRequest } from '../../app/Services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData: LoginRequest = {
    email: '',
    password: ''
  };

  errorMessage: string = '';

  constructor(private loginService: LoginService, private router: Router) {}

  login(form: NgForm) {
    this.errorMessage = '';

    if (form.invalid) {
      this.errorMessage = 'Please fill all fields correctly.';
      return;
    }

    this.loginService.loginUser(this.loginData).subscribe(
      (res) => {
        alert(res.message);

        const role = res.role;

        if (role === 'Admin') {
          localStorage.setItem('token', res.token!);
          this.router.navigate(['/admin-dashboard']);
        } else if (role === 'Teacher') {
          localStorage.setItem('teacherId', res.id!.toString());
          this.router.navigate(['/teacher-dashboard']);
        } else if (role === 'Student') {
          localStorage.setItem('studentId', res.id!.toString());
          this.router.navigate(['/student-dashboard']);
        } else {
          this.errorMessage = 'Unknown role returned from server.';
        }
      },
      err => {
        alert(err.error?.message || 'Login failed. Please check your credentials.');
      }
    );
  }

  clearForm() {
    this.loginData = {
      email: '',
      password: ''
    };
  }

  goBack() {
    this.router.navigate(['/']); // Navigate to home
  }
}
