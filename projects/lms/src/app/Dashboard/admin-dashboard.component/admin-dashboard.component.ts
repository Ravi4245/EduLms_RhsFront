import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../Services/admin';


interface Student {
  studentId: number;
  fullName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  dateOfBirth?: string; // use string to handle two-way binding properly
  gender?: string;
  address?: string;
  gradeLevel?: string;
  studentNo?: string;
}

interface Teacher {
  teacherId: number;
  fullName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  qualification?: string;
  experienceYears?: number;
  specialization?: string;
  teacherNo?: string;
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
  activeSection: string = 'pending-students';

  constructor(private adminService: AdminService, private cd: ChangeDetectorRef) {}

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

  loadPendingStudents() {
    this.adminService.getPendingStudents().subscribe((data) => {
      this.pendingStudents = data;
      this.cd.detectChanges();
    });
  }

  loadApprovedStudents() {
    this.adminService.getApprovedStudents().subscribe((data) => {
      this.approvedStudents = data;
      this.cd.detectChanges();
    });
  }

  approveStudent(id: number) {
    this.adminService.approveStudent(id).subscribe((res) => {
      alert(res.message);
      this.refreshAllData();
    });
  }

  rejectStudent(id: number) {
    this.adminService.rejectStudent(id).subscribe((res) => {
      alert(res.message);
      this.refreshAllData();
    });
  }

  deleteApprovedStudent(id: number) {
    this.adminService.canDeleteStudent(id).subscribe({
      next: (checkRes) => {
        if (!checkRes.canDelete) {
          alert("❌ Cannot delete: This student is assigned to a course or has submitted assignments.");
          return;
        }
        if (confirm("Are you sure you want to delete this approved student?")) {
          this.adminService.deleteApprovedStudent(id).subscribe({
            next: (res) => {
              alert(res.message || "✅ Student deleted successfully");
              this.refreshAllData();
            },
            error: (err) => {
              alert(err.error?.message || "❌ Error deleting student");
            }
          });
        }
      },
      error: () => {
        alert("❌ Error checking if student can be deleted.");
      }
    });
  }

  updateStudentProfile(student: Student) {

  
    this.adminService.updateStudent(student).subscribe({
      next: (res) => {
        alert(res.message || '✅ Student profile updated successfully');
          this.editingStudent = null;
        this.loadApprovedStudents();
      },
      error: (err) => {
        alert(err.error?.message || '❌ Error updating student profile');
      }
    });
  }

  // TEACHERS

  loadPendingTeachers() {
    this.adminService.getPendingTeachers().subscribe((data) => {
      this.pendingTeachers = data;
      this.cd.detectChanges();
    });
  }

  loadApprovedTeachers() {
    this.adminService.getApprovedTeachers().subscribe((data) => {
      this.approvedTeachers = data;
      this.cd.detectChanges();
    });
  }

  approveTeacher(id: number) {
    this.adminService.approveTeacher(id).subscribe((res) => {
      alert(res.message);
      this.refreshAllData();
    });
  }

  rejectTeacher(id: number) {
    this.adminService.rejectTeacher(id).subscribe((res) => {
      alert(res.message);
      this.refreshAllData();
    });
  }

  deleteApprovedTeacher(id: number) {
    this.adminService.canDeleteTeacher(id).subscribe({
      next: (checkRes) => {
        if (!checkRes.canDelete) {
          alert("❌ Cannot delete: This teacher has created or is assigned to courses.");
          return;
        }
        if (confirm("Are you sure you want to delete this approved teacher?")) {
          this.adminService.deleteApprovedTeacher(id).subscribe({
            next: (res) => {
              alert(res.message || "✅ Teacher deleted successfully");
              this.refreshAllData();
            },
            error: (err) => {
              alert(err.error?.message || "❌ Error deleting teacher");
            }
          });
        }
      },
      error: () => {
        alert("❌ Error checking if teacher can be deleted.");
      }
    });
  }

  updateTeacherProfile(teacher: Teacher) {
 
    this.adminService.updateTeacher(teacher).subscribe({
      next: (res) => {
        alert(res.message || '✅ Teacher profile updated successfully');
        this.editingTeacher = null;
        this.loadApprovedTeachers();
      },
      error: (err) => {
        alert(err.error?.message || '❌ Error updating teacher profile');
      }
    });
  }

  // COURSES

  loadCourses() {
    this.adminService.getCourses().subscribe((data) => {
      this.courses = data;
      this.cd.detectChanges();
    });
  }

  deleteCourse(id: number) {
    this.adminService.canDeleteCourse(id).subscribe({
      next: (checkRes) => {
        if (!checkRes.canDelete) {
          alert("❌ Cannot delete: This course has assigned students or existing assignments.");
          return;
        }
        if (confirm("Are you sure you want to delete this course?")) {
          this.adminService.deleteCourse(id).subscribe({
            next: (res) => {
              alert(res.message || "✅ Course deleted successfully");
              this.loadCourses();
            },
            error: (err) => {
              alert(err.error?.message || "❌ Error deleting course");
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
    this.editingCourse = { ...course };
  }

  saveCourse() {
    if (!this.editingCourse) return;

    this.adminService.updateCourse(this.editingCourse).subscribe((res) => {
      alert(res.message);
      this.editingCourse = null;
      this.loadCourses();
    });
  }

  cancelEdit() {
    this.editingCourse = null;
  }

  // PERFORMANCE REPORTS

  loadPerformanceReports() {
    this.adminService.getPerformanceReports().subscribe((data) => {
      this.performanceReports = data;
      this.cd.detectChanges();
    });
  }

  // UI Logic (unchanged)
  startEditStudent(student: Student) {
    this.editingStudent = { ...student };
  }

  startEditTeacher(teacher: Teacher) {
    this.editingTeacher = { ...teacher };
  }

  saveTeacher() {
    if (this.editingTeacher) {
      this.updateTeacherProfile(this.editingTeacher);
      this.editingTeacher = null;
    }
  }


  saveStudent() {
  if (this.editingStudent) {
    this.updateStudentProfile(this.editingStudent);
    this.editingStudent = null;
  }
}



  setActiveSection(section: string) {
    this.activeSection = section;
  }

  getPaginatedData<T>(data: T[], page: number): T[] {
    const startIndex = (page - 1) * this.itemsPerPage;
    return data.slice(startIndex, startIndex + this.itemsPerPage);
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

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  }
}