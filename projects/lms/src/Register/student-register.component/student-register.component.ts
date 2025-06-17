import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './student-register.component.html',
  styleUrls: ['./student-register.component.css']
})
export class StudentRegisterComponent {
  student = {
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    gradeLevel: '',
    studentNo: ''
  };

  captcha = '';
  userCaptchaInput = '';

  constructor(private http: HttpClient, private router: Router) {
    this.generateCaptcha();
  }

  generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let generated = '';
    for (let i = 0; i < 6; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.captcha = generated;
  }

  registerStudent() {
    this.http.post('https://localhost:7072/api/Student/RegisterStudent', this.student).subscribe({
      next: (res:any) => {
        alert(res.message);
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        alert('❌ Registration failed.');
        console.error(err);
      }
    });
  }

  clearForm() {
    this.student = {
      fullName: '',
      email: '',
      password: '',
      phoneNumber: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      gradeLevel: '',
      studentNo: ''
    };
    this.userCaptchaInput = '';
    this.generateCaptcha();
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
