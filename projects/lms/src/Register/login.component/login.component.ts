import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    password: '',
    role: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  login() {
  const apiUrl = 'https://localhost:44361/api/Login/Login';

  this.http.post(apiUrl, this.loginData).subscribe(
    (res: any) => {
      alert(res.message); // Shows "Login successful as Student" etc.

      localStorage.setItem('token', res.token);

      // ✅ Store ID based on role
      if (res.role === 'Student') {
        localStorage.setItem('studentId', res.id);  // FIXED ✅
        this.router.navigate(['/student-dashboard']);
      } else if (res.role === 'Teacher') {
        localStorage.setItem('teacherId', res.id);  // FIXED ✅
        this.router.navigate(['/teacher-dashboard']);
      } else if (res.role === 'Admin') {
        this.router.navigate(['/admin-dashboard']);
      }
    },
    err => {
      alert(err.error || 'Login failed. Please check credentials.');
    }
  );
}

}
