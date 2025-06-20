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
  editingStudent: Student | null = null;
editingTeacher: Teacher | null = null;



 

  studentPage: number = 1;
approvedStudentPage: number = 1;
teacherPage: number = 1;
approvedTeacherPage: number = 1;
coursePage: number = 1;
reportPage: number = 1;

itemsPerPage: number = 5;

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

// In your component class:
startEditTeacher(teacher: Teacher) {
  this.editingTeacher = { ...teacher };
}

startEditStudent(student: Student) {
  this.editingStudent = { ...student };
}

saveTeacher() {
  if (this.editingTeacher) {
    this.updateTeacherProfile(this.editingTeacher);
    this.editingTeacher = null;
  }
}


  loadApprovedStudents() {
    this.http.get<Student[]>('https://localhost:7072/api/Admin/ApprovedStudents')
      .subscribe((data) => {
        this.approvedStudents = data;
        this.cd.detectChanges();
      });
  }

  getPaginatedData<T>(data: T[], page: number): T[] {
  const startIndex = (page - 1) * this.itemsPerPage;
  return data.slice(startIndex, startIndex + this.itemsPerPage);
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
  this.http.get<{ canDelete: boolean }>(`https://localhost:7072/api/Admin/CanDeleteStudent/${id}`)
    .subscribe({
      next: (checkRes) => {
        if (!checkRes.canDelete) {
          alert("❌ Cannot delete: This student is assigned to a course or has submitted assignments.");
          return;
        }

        if (confirm("Are you sure you want to delete this approved student?")) {
          this.http.delete<any>(`https://localhost:7072/api/Admin/DeleteApprovedStudent/${id}`)
            .subscribe({
              next: (res) => {
                alert(res.message || "✅ Student deleted successfully");
                this.refreshAllData();
              },
              error: (err) => {
                const errorMessage = err.error?.message || "❌ Error deleting student";
                alert(errorMessage);
              }
            });
        }
      },
      error: () => {
        alert("❌ Error checking if student can be deleted.");
      }
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
  this.http.get<{ canDelete: boolean }>(`https://localhost:7072/api/Admin/CanDeleteTeacher/${id}`)
    .subscribe({
      next: (checkRes) => {
        if (!checkRes.canDelete) {
          alert("❌ Cannot delete: This teacher has created or is assigned to courses.");
          return;
        }

        if (confirm("Are you sure you want to delete this approved teacher?")) {
          this.http.delete<any>(`https://localhost:7072/api/Admin/DeleteApprovedTeacher/${id}`)
            .subscribe({
              next: (res) => {
                alert(res.message || "✅ Teacher deleted successfully");
                this.refreshAllData();
              },
              error: (err) => {
                const errorMessage = err.error?.message || "❌ Error deleting teacher";
                alert(errorMessage);
              }
            });
        }
      },
      error: () => {
        alert("❌ Error checking if teacher can be deleted.");
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
  this.http.get<{ canDelete: boolean }>(`https://localhost:7072/api/Admin/CanDeleteCourse/${id}`)
    .subscribe({
      next: (checkRes) => {
        if (!checkRes.canDelete) {
          alert("❌ Cannot delete: This course has assigned students or existing assignments.");
          return;
        }

        if (confirm("Are you sure you want to delete this course?")) {
          this.http.delete<any>(`https://localhost:7072/api/Admin/DeleteCourse/${id}`)
            .subscribe({
              next: (res) => {
                alert(res.message || "✅ Course deleted successfully");
                this.loadCourses();
              },
              error: (err) => {
                const errorMessage = err.error?.message || "❌ Error deleting course";
                alert(errorMessage);
              }
            });
        }
      },
      error: () => {
        alert("❌ Error checking if course can be deleted.");
      }
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

 // Update approved student profile
updateStudentProfile(student: Student) {
  this.http.put<any>(`https://localhost:7072/api/Admin/UpdateStudent/${student.studentId}`, student)
    .subscribe({
      next: (res) => {
        alert(res.message || '✅ Student profile updated successfully');
        this.loadApprovedStudents();
      },
      error: (err) => {
        alert(err.error?.message || '❌ Error updating student profile');
      }
    });
}

// Update approved teacher profile
updateTeacherProfile(teacher: Teacher) {
  this.http.put<any>(`https://localhost:7072/api/Admin/UpdateTeacher/${teacher.teacherId}`, teacher)
    .subscribe({
      next: (res) => {
        alert(res.message || '✅ Teacher profile updated successfully');
        this.loadApprovedTeachers();
      },
      error: (err) => {
        alert(err.error?.message || '❌ Error updating teacher profile');
      }
    });
}

changePage(section: string, direction: 'next' | 'prev') {
  const totalPages = {
    teacher: Math.ceil(this.pendingTeachers.length / this.itemsPerPage),
    approvedTeacher: Math.ceil(this.approvedTeachers.length / this.itemsPerPage),
    student: Math.ceil(this.pendingStudents.length / this.itemsPerPage),
    approvedStudent: Math.ceil(this.approvedStudents.length / this.itemsPerPage),
    course: Math.ceil(this.courses.length / this.itemsPerPage),
    report: Math.ceil(this.performanceReports.length / this.itemsPerPage),
  };

  switch (section) {
    case 'teacher':
      if (direction === 'next' && this.teacherPage < totalPages.teacher) this.teacherPage++;
      else if (direction === 'prev' && this.teacherPage > 1) this.teacherPage--;
      break;

    case 'approvedTeacher':
      if (direction === 'next' && this.approvedTeacherPage < totalPages.approvedTeacher) this.approvedTeacherPage++;
      else if (direction === 'prev' && this.approvedTeacherPage > 1) this.approvedTeacherPage--;
      break;

    case 'student':
      if (direction === 'next' && this.studentPage < totalPages.student) this.studentPage++;
      else if (direction === 'prev' && this.studentPage > 1) this.studentPage--;
      break;

    case 'approvedStudent':
      if (direction === 'next' && this.approvedStudentPage < totalPages.approvedStudent) this.approvedStudentPage++;
      else if (direction === 'prev' && this.approvedStudentPage > 1) this.approvedStudentPage--;
      break;

    case 'course':
      if (direction === 'next' && this.coursePage < totalPages.course) this.coursePage++;
      else if (direction === 'prev' && this.coursePage > 1) this.coursePage--;
      break;

    case 'report':
      if (direction === 'next' && this.reportPage < totalPages.report) this.reportPage++;
      else if (direction === 'prev' && this.reportPage > 1) this.reportPage--;
      break;
  }
}


updatePage(section: string, page: number) {
  switch (section) {
    case 'teacher':
      this.teacherPage = page;
      break;
    case 'student':
      this.studentPage = page;
      break;
    case 'report':
      this.reportPage = page;
      break;
    case 'course':
      this.coursePage = page;
      break;
  }
}




}
