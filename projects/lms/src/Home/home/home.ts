import { Component, HostBinding, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
//import { AdminService } from '../../app/Services/admin.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  darkMode: boolean = false;

  // studentCount: number = 0;
  // teacherCount: number = 0;

  @HostBinding('class.dark-mode') get isDarkMode() {
    return this.darkMode;
  }

  constructor(private router: Router) {}

  ngOnInit() {
    // this.loadCounts();
  }

//   loadCounts() {
//     this.adminService.getApprovedStudentsCount().subscribe({
//   next: (res: { count: number }) => this.studentCount = res.count,

//   error: (err: any) => console.error('Failed to load student count', err)
// });


//    this.adminService.getApprovedTeachersCount().subscribe({
//  next: (res: { count: number }) => this.teacherCount = res.count,

//   error: (err: any) => console.error('Failed to load teacher count', err)
// });

//   }

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

  goToFeatureDetail(type: string) {
    this.router.navigate(['feature-details', type]);
  }
}
