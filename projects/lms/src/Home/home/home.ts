import { Component, HostBinding, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  darkMode: boolean = false;

  feedback = {
    email: '',
    message: ''
  };

  captchaNum1 = 0;
  captchaNum2 = 0;
  captchaAnswer = 0;

  @HostBinding('class.dark-mode') get isDarkMode() {
    return this.darkMode;
  }

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.generateCaptcha();
  }

  goToStudentRegister() {
    this.router.navigate(['/student-register']);
  }

  goToTeacherRegister() {
    this.router.navigate(['/teacher-register']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  }

  goToFeatureDetail(type: string) {
    this.router.navigate(['feature-details', type]);
  }

  generateCaptcha() {
    this.captchaNum1 = Math.floor(Math.random() * 10);
    this.captchaNum2 = Math.floor(Math.random() * 10);
  }

  submitFeedback(form: NgForm) {
    const correctAnswer = this.captchaNum1 + this.captchaNum2;
    if (this.captchaAnswer !== correctAnswer) {
      alert('❌ CAPTCHA is incorrect!');
      this.generateCaptcha();
      return;
    }

    this.http.post('https://localhost:7072/api/Feedback/Submit', this.feedback).subscribe({
      next: () => {
        alert('✅ Feedback submitted successfully!');
        form.resetForm(); // Clears all fields
        this.generateCaptcha(); // Refresh CAPTCHA
      },
      error: () => {
        alert('❌ Failed to submit feedback.');
      }
    });
  }
}
