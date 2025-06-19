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

  hasInvalidFullName = false;

checkFullName() {
  // Only allow letters, spaces, apostrophes, and hyphens
  const validNamePattern = /^[a-zA-Z\s'-]+$/;

  // Set to true if the full name does NOT match the valid pattern
  this.hasInvalidFullName = !validNamePattern.test(this.student.fullName);
}

  hasInvalidEmailFormat = false;

checkEmail() {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|co\.in|in)$/;
  this.hasInvalidEmailFormat = !pattern.test(this.student.email || '');
}
hasInvalidPasswordFormat = false;

checkPassword() {
  const strongPasswordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
  this.hasInvalidPasswordFormat = !strongPasswordPattern.test(this.student.password);
}
hasInvalidPhoneFormat = false;

checkPhoneNumber() {
    const phonePattern = /^\d{10}$/;
    this.hasInvalidPhoneFormat = !phonePattern.test(this.student.phoneNumber);
  }

hasInvalidStudentNo = false;

checkStudentNo() {
  const validStudentNoPattern = /^\d{1,5}$/; // 1 to 5 digits only
  this.hasInvalidStudentNo = !validStudentNoPattern.test(this.student.studentNo);
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
