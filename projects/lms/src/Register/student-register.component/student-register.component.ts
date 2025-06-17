import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-register',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule],
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

  constructor(private http: HttpClient, private router: Router) {}

  registerStudent() {
    this.http.post('https://localhost:44361/api/Student/RegisterStudent', this.student).subscribe({
      next: (res:any) => {
        alert(res.message);
      
        this.router.navigate(['/']);
      },
      error: (err) => {
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
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
