import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ---------- Interfaces ----------
interface Student {
  studentId: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
}

interface Teacher {
  teacherId: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
}

interface Course {
  courseId: number;
  courseName: string;
  description: string;
  category?: string;
  createdByTeacherId?: number;
}

interface PerformanceReport {
  reportId?: number;
  studentId: number;
  courseId: number;
  averageGrade: number;
  remarks: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  pendingStudents: Student[] = [];
  approvedStudents: Student[] = [];
  pendingTeachers: Teacher[] = [];
  approvedTeachers: Teacher[] = [];
  courses: Course[] = [];
  performanceReports: PerformanceReport[] = [];

  editingCourse: Course | null = null;
  activeSection: string = 'pending-students'; // default section

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.refreshAllData();
  }

  refreshAllData() {
    this.loadPendingStudents();
    this.loadApprovedStudents();
    this.loadPendingTeachers();
    this.loadApprovedTeachers();
    this.loadCourses();
    this.loadPerformanceReports();
  }

  // ---------------------- Students ----------------------

  loadPendingStudents() {
    this.http.get<Student[]>('https://localhost:7072/api/Admin/PendingStudents')
      .subscribe((data) => {
        this.pendingStudents = data;
        this.cd.detectChanges();
      });
  }

  setActiveSection(section: string) {
  this.activeSection = section;
}

  loadApprovedStudents() {
    this.http.get<Student[]>('https://localhost:7072/api/Admin/ApprovedStudents')
      .subscribe((data) => {
        this.approvedStudents = data;
        this.cd.detectChanges();
      });
  }

  approveStudent(id: number) {
    this.http.put<any>(`https://localhost:7072/api/Admin/ApproveStudent/${id}`, {})
      .subscribe((response) => {
        alert(response.message);
        this.refreshAllData();
      });
  }

  rejectStudent(id: number) {
    this.http.delete<any>(`https://localhost:7072/api/Admin/RejectStudent/${id}`)
      .subscribe((response) => {
        alert(response.message);
        this.refreshAllData();
      });
  }

 deleteApprovedStudent(id: number) {
  this.http.delete<any>(`https://localhost:7072/api/Admin/DeleteApprovedStudent/${id}`)
    .subscribe((res) => {
      alert(res.message);
      this.refreshAllData();
    }, (err) => {
      alert(err.error.message || "Error deleting student");
    });
}

  // ---------------------- Teachers ----------------------

  loadPendingTeachers() {
    this.http.get<Teacher[]>('https://localhost:7072/api/Admin/PendingTeachers')
      .subscribe((data) => {
        this.pendingTeachers = data;
        this.cd.detectChanges();
      });
  }

  loadApprovedTeachers() {
    this.http.get<Teacher[]>('https://localhost:7072/api/Admin/ApprovedTeachers')
      .subscribe((data) => {
        this.approvedTeachers = data;
        this.cd.detectChanges();
      });
  }

  approveTeacher(id: number) {
    this.http.put<any>(`https://localhost:7072/api/Admin/ApproveTeacher/${id}`, {})
      .subscribe((response) => {
        alert(response.message);
        this.refreshAllData();
      });
  }

  rejectTeacher(id: number) {
    this.http.delete<any>(`https://localhost:7072/api/Admin/RejectTeacher/${id}`)
      .subscribe((response) => {
        alert(response.message);
        this.refreshAllData();
      });
  }

 deleteApprovedTeacher(id: number) {
  this.http.delete<any>(`https://localhost:7072/api/Admin/DeleteApprovedTeacher/${id}`)
    .subscribe({
      next: (res) => {
        alert(res.message);
        this.refreshAllData();
      },
      error: (err) => {
        alert(err.error.message || "Error deleting teacher");
      }
    });
}

  // ---------------------- Courses ----------------------

  loadCourses() {
    this.http.get<Course[]>('https://localhost:7072/api/Admin/Courses')
      .subscribe((data) => {
        this.courses = data;
        this.cd.detectChanges();
      });
  }

  deleteCourse(id: number) {
    this.http.delete<any>(`https://localhost:7072/api/Admin/DeleteCourse/${id}`)
      .subscribe((response) => {
        alert(response.message);
        this.loadCourses();
      });
  }

  editCourse(course: Course) {
    this.editingCourse = { ...course }; // Clone the course
  }

  saveCourse() {
    if (!this.editingCourse) return;

    this.http.put<any>(`https://localhost:7072/api/Admin/UpdateCourse/${this.editingCourse.courseId}`, this.editingCourse)
      .subscribe((response) => {
        alert(response.message);
        this.editingCourse = null;
        this.loadCourses();
      });
  }

  cancelEdit() {
    this.editingCourse = null;
  }

  // ---------------------- Performance ----------------------

  loadPerformanceReports() {
    this.http.get<PerformanceReport[]>('https://localhost:7072/api/Admin/StudentPerformance')
      .subscribe((data) => {
        this.performanceReports = data;
        this.cd.detectChanges();
      });
  }

  logout(): void {
  // Clear any stored tokens or session data
  localStorage.clear();
  sessionStorage.clear();

  // Optionally, you can redirect to login page
  window.location.href = '/login'; // Adjust path if needed
}

}
