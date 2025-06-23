import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TeacherDashboardService } from '../../Services/teacher-dashboard';

interface AssignmentModel {
  assignmentId: number;
  courseId: number;
  teacherId: number;
  title: string;
  description?: string;
  uploadFilePath?: string;
  dueDate: string;
}

interface Student {
  StudentId: number;
  StudentName: string;
  Email: string;
}

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css']
})
export class TeacherDashboardComponent implements OnInit {
  teacherId!: number;
  activeSection: string = 'profile';

  selectedFile: File | null = null;
  profile: any = {};
  courses: any[] = [];
  assignments: AssignmentModel[] = [];
  submissions: any[] = [];
  performanceReports: any[] = [];
  enrolledStudents: any[] = [];
  selectedCoursePdf: File | null = null;
  editingReportId: number | null = null;
  assignedStudentsByCourse: Student[] = [];
  assignedStudentsByAssignment: Student[] = [];

  currentPage: number = 1;
  currentAssignmentPage: number = 1;
  assignmentsPerPage: number = 5;
  paginatedAssignments: AssignmentModel[] = [];

  currentStudentPage: number = 1;
  studentsPerPage: number = 5;
  paginatedStudents: Student[] = [];

  itemsPerPage: number = 3;
  editingAssignment: AssignmentModel | null = null;

  newCourse = {
    courseName: '',
    description: '',
    category: '',
    createdByTeacherId: 0
  };

  assignByNameData = { studentName: '', assignmentTitle: '' };

  newAssignment = {
    courseId: null as number | null,
    teacherId: 0,
    title: '',
    description: '',
    uploadFilePath: '',
    dueDate: ''
  };

  newPerformance = {
    studentId: null as number | null,
    courseId: null as number | null,
    averageGrade: null as number | null,
    remarks: ''
  };

  assignCourseData = { studentId: null as number | null, courseId: null as number | null };
  assignAssignmentData = { studentId: null as number | null, assignmentId: null as number | null };

  constructor(private cd: ChangeDetectorRef, private router: Router, private service: TeacherDashboardService) {}

  ngOnInit(): void {
    const storedId = localStorage.getItem('teacherId');
    if (storedId) {
      this.teacherId = +storedId;
      this.newCourse.createdByTeacherId = this.teacherId;
      this.newAssignment.teacherId = this.teacherId;
      this.loadTeacherProfile();
      this.loadCourses();
      this.loadPerformanceReports();
      this.loadSubmittedAssignments();
      this.loadEnrolledStudents();
      this.loadAssignments();
    } else {
      alert('❌ Teacher ID not found. Please login again.');
    }
  }

  startEditAssignment(assignment: AssignmentModel) { this.editingAssignment = { ...assignment }; }
  cancelEdit() { this.editingAssignment = null; }

  viewPdf(path: string) {
    const fullPath = `https://localhost:7072/${path}`;
    window.open(fullPath, '_blank');
  }

  get paginatedEnrolledStudents() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.enrolledStudents.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.enrolledStudents.length / this.itemsPerPage);
  }

  loadTeacherProfile() {
    this.service.getTeacherProfile(this.teacherId).subscribe({
      next: res => { this.profile = res; this.cd.detectChanges(); },
      error: err => console.error('❌ Failed to load teacher profile', err)
    });
  }

  loadCourses() {
    this.service.getCourses(this.teacherId).subscribe(res => {
      this.courses = res;
      this.cd.detectChanges();
    });
  }

  onCoursePdfSelected(event: any) {
    if (event.target.files?.length > 0) this.selectedCoursePdf = event.target.files[0];
  }

  createCourse() {
    const formData = new FormData();
    Object.entries(this.newCourse).forEach(([key, val]) => formData.append(key, val.toString()));
    if (this.selectedCoursePdf) formData.append('PdfFile', this.selectedCoursePdf);
    this.service.createCourse(formData).subscribe(res => {
      alert(res.message);
      this.newCourse = { courseName: '', description: '', category: '', createdByTeacherId: this.teacherId };
      this.selectedCoursePdf = null;
      this.loadCourses();
    });
  }

  updateCourse(course: any) {
    this.service.updateCourse(course).subscribe(res => {
      alert(res.message);
      this.loadCourses();
    });
  }

  deleteCourse(courseId: number) {
    this.service.deleteCourse(courseId, this.teacherId).subscribe(res => {
      alert(res.message);
      this.loadCourses();
    });
  }

  onFileSelected(event: any): void { this.selectedFile = event.target.files[0]; }

  createAssignment() {
    const formData = new FormData();
    Object.entries(this.newAssignment).forEach(([key, val]) => val && formData.append(key, val.toString()));
    if (this.selectedFile) formData.append('file', this.selectedFile, this.selectedFile.name);
    this.service.createAssignment(formData).subscribe(res => {
      alert(res.message);
      this.newAssignment = { courseId: null, teacherId: this.teacherId, title: '', description: '', uploadFilePath: '', dueDate: '' };
      this.selectedFile = null;
      this.loadAssignments();
    });
  }

  updatePaginatedAssignments() {
    const start = (this.currentAssignmentPage - 1) * this.assignmentsPerPage;
    this.paginatedAssignments = this.assignments.slice(start, start + this.assignmentsPerPage);
  }

  updatePaginatedStudents() {
    const start = (this.currentStudentPage - 1) * this.studentsPerPage;
    this.paginatedStudents = this.enrolledStudents.slice(start, start + this.studentsPerPage);
  }

  loadAssignments() {
    this.service.getAssignments(this.teacherId).subscribe(data => {
      this.assignments = data;
      this.updatePaginatedAssignments();
      this.cd.detectChanges();
    });
  }

  updateAssignment() {
    if (!this.editingAssignment) return;
    this.service.updateAssignment(this.editingAssignment.assignmentId, this.editingAssignment).subscribe(response => {
      alert(response.message);
      this.loadAssignments();
      this.editingAssignment = null;
    });
  }

  editReport(report: any) { this.editingReportId = report.performanceReportId; }

  deleteAssignment(id: number) {
    if (confirm('Are you sure you want to delete this assignment?')) {
      this.service.deleteAssignment(id).subscribe(response => {
        alert(response.message);
        this.loadAssignments();
      });
    }
  }

  assignAssignmentToStudenta() {
    const { studentId, assignmentId } = this.assignAssignmentData;
    this.service.assignAssignment(studentId!, assignmentId!).subscribe(res => {
      alert(res.message);
      this.assignAssignmentData = { studentId: null, assignmentId: null };
      this.loadSubmittedAssignments();
    });
  }

  viewSubmissions(assignmentId: number) {
    this.service.viewSubmissions(assignmentId).subscribe(res => {
      this.submissions = res;
      this.cd.detectChanges();
    });
  }

  loadSubmittedAssignments() {
    this.service.getSubmittedAssignments(this.teacherId).subscribe(res => {
      this.submissions = res;
      this.cd.detectChanges();
    });
  }

  gradeSubmission(sub: any) {
    this.service.gradeSubmission(sub).subscribe(res => {
      alert(res.message);
      this.viewSubmissions(sub.assignmentId);
    });
  }

  loadPerformanceReports() {
    this.service.getPerformanceReports().subscribe(res => {
      this.performanceReports = res;
      this.cd.detectChanges();
    });
  }

  createPerformance() {
    this.service.createPerformance(this.newPerformance).subscribe(res => {
      alert(res.message);
      this.newPerformance = { studentId: null, courseId: null, averageGrade: null, remarks: '' };
      this.loadPerformanceReports();
    });
  }

  updatePerformance(report: any) {
    this.service.updatePerformance(report).subscribe(res => {
      alert(res.message);
      this.loadPerformanceReports();
    });
  }

  assignCourseToStudent() {
    const { studentId, courseId } = this.assignCourseData;
    this.service.assignCourse(studentId!, courseId!).subscribe(res => {
      alert(res.message);
      this.assignCourseData = { studentId: null, courseId: null };
      this.loadEnrolledStudents();
    });
  }

  loadEnrolledStudents() {
    this.service.getApprovedStudents().subscribe(res => {
      this.enrolledStudents = res;
      this.updatePaginatedStudents();
      this.cd.detectChanges();
    });
  }

  logout() {
    localStorage.removeItem('teacherId');
    this.router.navigate(['/']);
  }

  loadCreatedAssignments() {
    this.service.getAssignments(this.teacherId).subscribe(res => {
      this.assignments = res;
    });
  }

  getAssignedStudentsByCourse(courseId: number) {
    this.service.getStudentsByCourse(courseId).subscribe(res => {
      this.assignedStudentsByCourse = res;
      this.cd.detectChanges();
    });
  }

  getAssignedStudentsByAssignment(assignmentId: number) {
    this.service.getStudentsByAssignment(assignmentId).subscribe(res => {
      this.assignedStudentsByAssignment = res;
      this.cd.detectChanges();
    });
  }
}