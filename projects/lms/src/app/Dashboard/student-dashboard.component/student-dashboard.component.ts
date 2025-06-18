import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
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

  selectedFile: File | null = null;

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}

ngOnInit() {
  const storedId = localStorage.getItem('studentId');
  if (storedId) {
    this.studentId = +storedId;
    this.enrollData.studentId = this.studentId;
    this.submitData.studentId = this.studentId;

    this.refreshAll();  // This will load all needed data
  } else {
    alert("Student ID not found. Please login again.");
  }
}

  refreshAll() {
    this.loadProfile();
    this.loadMyCourses();
   // this.loadEnrolledCourses();
     this.loadAssignments();
    this.loadPerformanceReport();
    // this.loadAssignedAssignments(); 
     
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


  loadProfile() {
    this.http.get<any>(`https://localhost:7072/api/Student/Profile/${this.studentId}`)
      .subscribe({
        next: res => {
          this.profile = res;
          this.cd.detectChanges();
        },
        error: err => console.error('❌ Profile load error:', err)
      });
  }

loadMyCourses() {
  this.http.get<any[]>(`https://localhost:7072/api/Student/MyCourses/${this.studentId}`)
    .subscribe({
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




  loadEnrolledCourses() {
    this.http.get<any[]>(`https://localhost:7072/api/Student/EnrolledCourses/${this.studentId}`)
      .subscribe({
        next: res => {
          this.enrolledCourses = res;
          this.cd.detectChanges();
        },
        error: err => console.error('❌ Enrolled courses error:', err)
      });
  }

  logout() {
  localStorage.removeItem('studentId');
  alert('Logged out successfully!');
  window.location.href = '/'; // Or use Router if routing is enabled
}


  enrollCourse() {
    const { courseId } = this.enrollData;
    if (!courseId) {
      alert("❌ Please select a course to enroll.");
      return;
    }

    this.http.post<any>(
      `https://localhost:7072/api/Student/Enroll?studentId=${this.studentId}&courseId=${courseId}`,
      {}
    ).subscribe({
      next: res => {
        alert(res.message);
        this.enrollData.courseId = null;
        this.loadEnrolledCourses();
      },
      error: err => {
        console.error('❌ Enroll error:', err);
        alert("Enrollment failed.");
      }
    });
  }

 
loadAssignments() {
  this.http.get<any[]>(`https://localhost:7072/api/Student/MyAssignments/${this.studentId}`)
    .subscribe({
      next: res => {
        this.assignedAssignments = res;  // use assignedAssignments here
        this.cd.detectChanges();
      },
      error: err => console.error('❌ Assignment load error:', err)
    });
}

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submitAssignment() {
    if (!this.selectedFile || !this.submitData.assignmentId) {
      alert("❌ Please select both assignment and file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", this.selectedFile);

    const url = `https://localhost:7072/api/Student/SubmitAssignment?assignmentId=${this.submitData.assignmentId}&studentId=${this.studentId}`;

    this.http.post<{ message: string }>(url, formData).subscribe({
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

  loadPerformanceReport() {
    this.http.get<any[]>(`https://localhost:7072/api/Student/PerformanceReport/${this.studentId}`)
      .subscribe({
        next: res => {
          this.performanceReports = res;
          this.cd.detectChanges();
        },
        error: err => console.error('❌ Performance report error:', err)
      });
  }

  loadAssignedAssignments() {
  const studentId = localStorage.getItem('studentId');
  this.http.get<any[]>(`https://localhost:7072/api/Teacher/StudentAssignments/${studentId}`)
    .subscribe(res => {
      this.assignedAssignments = res;
    });
}


}
