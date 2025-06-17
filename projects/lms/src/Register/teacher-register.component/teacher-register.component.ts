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

  hasNumberInFullName = false;
  hasInvalidEmailFormat = false;
  hasInvalidPasswordFormat = false;
  hasInvalidPhoneFormat = false;
  hasInvalidTeacherNo = false;

  // Full Name validation: no numbers allowed
  checkFullName() {
    const regex = /\d/;
    this.hasNumberInFullName = regex.test(this.teacher.fullName);
  }

  // Email validation: username@example.com
  checkEmail() {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|co\.in)$/;
  this.hasInvalidEmailFormat = !pattern.test(this.teacher.email || '');
}


  // Password validation: min 8 chars, max 20 chars, at least one uppercase, one number, one special char
  checkPassword() {
    const pwdPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,20}$/;
    this.hasInvalidPasswordFormat = !pwdPattern.test(this.teacher.password);
  }

  // Phone Number validation: exactly 10 digits only
  checkPhoneNumber() {
    const phonePattern = /^\d{10}$/;
    this.hasInvalidPhoneFormat = !phonePattern.test(this.teacher.phoneNumber);
  }

  // Teacher No validation: up to 5 digits only
  checkTeacherNo() {
    const teacherNoPattern = /^\d{1,5}$/;
    this.hasInvalidTeacherNo = !teacherNoPattern.test(this.teacher.teacherNO);
  }

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
  registerTeachera(teacherForm: any) {
    if (
      teacherForm.invalid ||
      this.hasNumberInFullName ||
      this.hasInvalidEmailFormat ||
      this.hasInvalidPasswordFormat ||
      this.hasInvalidPhoneFormat ||
      this.hasInvalidTeacherNo
    ) {
      alert('❌ Please enter all details correctly.');
      return;
    }
  }
  registerTeacher() {
    this.http.post('https://localhost:7072/api/Teacher/RegisterTeacher', this.teacher).subscribe({
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
