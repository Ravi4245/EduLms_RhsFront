import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teacher-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './teacher-register.component.html',
  styleUrls: ['./teacher-register.component.css']
})
export class TeacherRegisterComponent {
  teacher = {
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    qualification: '',
    experienceYears: null,
    specialization: '',
    teacherNO: ''
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

  registerTeacher() {
    this.http.post('https://localhost:44361/api/Teacher/RegisterTeacher', this.teacher).subscribe({
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
    this.teacher = {
      fullName: '',
      email: '',
      password: '',
      phoneNumber: '',
      qualification: '',
      experienceYears: null,
      specialization: '',
      teacherNO: ''
    };
    this.userCaptchaInput = '';
    this.generateCaptcha();
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
