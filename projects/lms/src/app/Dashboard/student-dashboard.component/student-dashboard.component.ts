import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StudentPerformanceChartComponent } from '../student-performance-chart/student-performance-chart';
import { StudentDashboardService } from '../../Services/student-dashboard';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, StudentPerformanceChartComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  studentId!: number;
  activeSection: string = 'profile';
  profile: any = {};
  enrolledCourses: any[] = [];
  assignments: any[] = [];
  performanceReports: any[] = [];
  assignedAssignments: any[] = [];
  courses: any[] = [];
  showChart: boolean = false;
  selectedFile: File | null = null;

  enrollData: { studentId: number; courseId: number | null } = {
    studentId: 0,
    courseId: null
  };

  submitData: {
    studentId: number;
    assignmentId: number | null;
    filePath: string;
  } = {
    studentId: 0,
    assignmentId: null,
    filePath: ''
  };

  constructor(
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private service: StudentDashboardService
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const storedId = localStorage.getItem('studentId');
      if (storedId) {
        this.studentId = +storedId;
        this.enrollData.studentId = this.studentId;
        this.submitData.studentId = this.studentId;

        this.refreshAll();
      } else {
        alert("Student ID not found. Please login again.");
      }
    }
  }

  refreshAll() {
    this.loadProfile();
    this.loadMyCourses();
    this.loadAssignments();
    this.loadPerformanceReport();
  }

  loadProfile() {
    this.service.getProfile(this.studentId).subscribe({
      next: res => {
        this.profile = res;
        this.cd.detectChanges();
      },
      error: err => console.error('❌ Profile load error:', err)
    });
  }

  loadMyCourses() {
    this.service.getMyCourses(this.studentId).subscribe({
      next: res => {
        this.enrolledCourses = res;
        console.log("✅ My Courses with PDFs:", this.enrolledCourses);
        this.enrolledCourses.forEach(course => {
          console.log("PDF Path:", course.pdfFilePath);
        });
      },
      error: err => {
        console.error("❌ Failed to load courses", err);
        alert("Failed to load courses.");
      }
    });
  }

  loadAssignments() {
    this.service.getAssignments(this.studentId).subscribe({
      next: res => {
        this.assignedAssignments = res;
        this.cd.detectChanges();
      },
      error: err => console.error('❌ Assignment load error:', err)
    });
  }

  loadPerformanceReport() {
    this.service.getPerformanceReports(this.studentId).subscribe({
      next: res => {
        this.performanceReports = res;
        this.showChart = true;
        this.cd.detectChanges();
      },
      error: err => console.error('❌ Performance report error:', err)
    });
  }

  enrollCourse() {
    const { courseId } = this.enrollData;
    if (!courseId) {
      alert("❌ Please select a course to enroll.");
      return;
    }

    this.service.enrollCourse(this.studentId, courseId).subscribe({
      next: res => {
        alert(res.message);
        this.enrollData.courseId = null;
        this.loadMyCourses();
      },
      error: err => {
        console.error('❌ Enroll error:', err);
        alert("Enrollment failed.");
      }
    });
  }

  submitAssignment() {
    if (!this.selectedFile || !this.submitData.assignmentId) {
      alert("❌ Please select both assignment and file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", this.selectedFile);

    this.service.submitAssignment(this.submitData.assignmentId, this.studentId, formData).subscribe({
      next: res => {
        alert(res.message);
        this.submitData.assignmentId = null;
        this.selectedFile = null;
        this.loadAssignments();
      },
      error: err => {
        console.error("❌ Upload failed:", err);
        alert("❌ Upload failed.");
      }
    });
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  viewPdfa(pdfPath: string) {
    const fullUrl = `https://localhost:7072/${pdfPath}`;
    window.open(fullUrl, '_blank');
  }

  viewPdf(pdfUrl: string) {
    window.open(pdfUrl, '_blank');
  }

  trackByCourseId(index: number, course: any): number {
    return course.courseId;
  }

  loadAssignedAssignments() {
    const studentId = localStorage.getItem('studentId');
    if (studentId) {
      this.service.getAssignedAssignments(+studentId).subscribe(res => {
        this.assignedAssignments = res;
      });
    }
  }

  onSectionChange(section: string) {
    this.activeSection = section;
    if (section === 'performance') {
      this.loadPerformanceReport();
    }
  }

  logout() {
    localStorage.removeItem('studentId');
    alert('Logged out successfully!');
    window.location.href = '/';
  }
}
