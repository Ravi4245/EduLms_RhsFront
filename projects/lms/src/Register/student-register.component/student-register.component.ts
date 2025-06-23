import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StudentRegisterService,StudentModel } from '../../app/Services/student-register.service';

@Component({
  selector: 'app-student-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './student-register.component.html',
  styleUrls: ['./student-register.component.css']
})
export class StudentRegisterComponent {
  student: StudentModel = {
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

  hasInvalidFullName = false;
  hasInvalidEmailFormat = false;
  hasInvalidPasswordFormat = false;
  hasInvalidPhoneFormat = false;
  hasInvalidStudentNo = false;

  captcha = '';
  userCaptchaInput = '';

  constructor(private service: StudentRegisterService, private router: Router) {
    this.generateCaptcha();
  }

  checkFullName() {
    const validNamePattern = /^[a-zA-Z\s'-]+$/;
    this.hasInvalidFullName = !validNamePattern.test(this.student.fullName);
  }

  checkEmail() {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|co\.in|in)$/;
    this.hasInvalidEmailFormat = !pattern.test(this.student.email || '');
  }

  checkPassword() {
    const strongPasswordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
    this.hasInvalidPasswordFormat = !strongPasswordPattern.test(this.student.password);
  }

  checkPhoneNumber() {
    const phonePattern = /^\d{10}$/;
    this.hasInvalidPhoneFormat = !phonePattern.test(this.student.phoneNumber);
  }

  checkStudentNo() {
    const validStudentNoPattern = /^\d{1,5}$/;
    this.hasInvalidStudentNo = !validStudentNoPattern.test(this.student.studentNo);
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
    this.service.registerStudent(this.student).subscribe({
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
