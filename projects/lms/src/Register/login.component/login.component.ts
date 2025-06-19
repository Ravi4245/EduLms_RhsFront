import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login(form: NgForm) {
    this.errorMessage = '';

    // ✅ Check if form is invalid
    if (form.invalid) {
      this.errorMessage = 'Please fill all fields correctly.';
      return;
    }

    const apiUrl = 'https://localhost:7072/api/Login/Login';

    this.http.post(apiUrl, this.loginData).subscribe(
      (res: any) => {
        alert(res.message); // e.g., "Login successful as Student"

        // ✅ Use role returned from backend
        const role = res.role;

        if (role === 'Admin') {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/admin-dashboard']);
        } else if (role === 'Teacher') {
          localStorage.setItem('teacherId', res.id);
          this.router.navigate(['/teacher-dashboard']);
        } else if (role === 'Student') {
          localStorage.setItem('studentId', res.id);
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
