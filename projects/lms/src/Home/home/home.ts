import { Component, HostBinding, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { FeedbackService,Feedback } from '../../app/Services/feedback.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  darkMode: boolean = false;

  feedback: Feedback = {
    email: '',
    message: ''
  };

  captchaNum1 = 0;
  captchaNum2 = 0;
  captchaAnswer = 0;

  @HostBinding('class.dark-mode') get isDarkMode() {
    return this.darkMode;
  }

  constructor(private router: Router, private feedbackService: FeedbackService) {}

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

    this.feedbackService.submitFeedback(this.feedback).subscribe({
      next: () => {
        alert('✅ Feedback submitted successfully!');
        form.resetForm();
        this.generateCaptcha();
      },
      error: () => {
        alert('❌ Failed to submit feedback.');
      }
    });
  }
}
