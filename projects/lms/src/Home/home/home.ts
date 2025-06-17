import { Component, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  darkMode: boolean = false;

  // Dynamically add/remove class on body using Angular
  @HostBinding('class.dark-mode') get isDarkMode() {
    return this.darkMode;
  }

  constructor(private router: Router) {}

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
  const body = document.body;
  body.classList.toggle('dark-mode');
}

  
}
