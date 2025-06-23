import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TeacherRegisterService,TeacherModel } from '../../app/Services/teacher-register-service';

@Component({
  selector: 'app-teacher-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './teacher-register.component.html',
  styleUrls: ['./teacher-register.component.css']
})
export class TeacherRegisterComponent {
  teacher: TeacherModel = {
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    qualification: '',
    experienceYears: null,
    specialization: '',
    teacherNO: ''
  };

  hasInvalidFullName = false;
  hasNumberInFullName = false;
  hasInvalidEmailFormat = false;
  hasInvalidPasswordFormat = false;
  hasInvalidPhoneFormat = false;
  hasInvalidTeacherNo = false;

  captcha = '';
  userCaptchaInput = '';

  constructor(private service: TeacherRegisterService, private router: Router) {
    this.generateCaptcha();
  }

  checkFullName() {
    const validNamePattern = /^[a-zA-Z\s'-]+$/;
    this.hasInvalidFullName = !validNamePattern.test(this.teacher.fullName);
  }

  checkEmail() {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|co\.in|in)$/;
    this.hasInvalidEmailFormat = !pattern.test(this.teacher.email || '');
  }

  checkPassword() {
    const pwdPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,20}$/;
    this.hasInvalidPasswordFormat = !pwdPattern.test(this.teacher.password);
  }

  checkPhoneNumber() {
    const phonePattern = /^\d{10}$/;
    this.hasInvalidPhoneFormat = !phonePattern.test(this.teacher.phoneNumber);
  }

  checkTeacherNo() {
    const teacherNoPattern = /^\d{1,5}$/;
    this.hasInvalidTeacherNo = !teacherNoPattern.test(this.teacher.teacherNO);
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
      this.hasInvalidFullName ||
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
    this.service.registerTeacher(this.teacher).subscribe({
      next: (res: any) => {
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
