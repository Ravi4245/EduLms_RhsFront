import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teacher-register',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule],
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
    experienceYears: 0,
    specialization: '',
    teacherNO: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  registerTeacher() {
    this.http.post('https://localhost:44361/api/Teacher/RegisterTeacher', this.teacher).subscribe({
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
}






