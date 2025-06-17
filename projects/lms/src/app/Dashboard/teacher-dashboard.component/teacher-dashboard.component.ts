import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css']
})

export class TeacherDashboardComponent implements OnInit {
  teacherId!: number;
  activeSection: string = 'profile'; // default section

  selectedFile: File | null = null;

  profile: any = {};  // ✅ NEW profile object

  courses: any[] = [];
  assignments: any[] = [];
  submissions: any[] = [];
  performanceReports: any[] = [];
  enrolledStudents: any[] = [];
  selectedCoursePdf: File | null = null;
  editingReportId: number | null = null;
  

newCourse = {
  courseName: '',
  description: '',
  category: '',
  createdByTeacherId: 0
};

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

  assignCourseData = {
    studentId: null as number | null,
    courseId: null as number | null
  };

  assignAssignmentData = {
    studentId: null as number | null,
    assignmentId: null as number | null
  };

//   onCoursePdfSelected(event: any): void {
//   this.selectedCoursePdf = event.target.files[0];
// }
  constructor(private http: HttpClient, private cd: ChangeDetectorRef,private router: Router) {}

  ngOnInit(): void {
    const storedId = localStorage.getItem('teacherId');
    if (storedId) {
      this.teacherId = +storedId;
      this.newCourse.createdByTeacherId = this.teacherId;
      this.newAssignment.teacherId = this.teacherId;

      this.loadTeacherProfile();      // ✅ Load profile
      this.loadCourses();
      this.loadPerformanceReports();
      this.loadSubmittedAssignments();
      this.loadEnrolledStudents();
      this.loadCreatedAssignments();
    } else {
      alert('❌ Teacher ID not found. Please login again.');
    }
  }

  viewPdf(path: string) {
  const fullPath = `https://localhost:7072/${path}`;
  window.open(fullPath, '_blank');
}

  cancelEdit() {
  this.editingReportId = null;
}

editReport(report: any) {
  this.editingReportId = report.performanceReportId;
}
  // ✅ Load Teacher Profile
  loadTeacherProfile() {
    this.http.get<any>(`https://localhost:7072/api/Teacher/Profile/${this.teacherId}`)

      .subscribe({
        next: res => {
          this.profile = res;
          this.cd.detectChanges();
        },
        error: err => {
          console.error('❌ Failed to load teacher profile', err);
        }
      });
  }

  // ------- Course Methods -------
  loadCourses() {
    this.http.get<any[]>(`https://localhost:7072/api/Teacher/MyCourses/${this.teacherId}`)
      .subscribe(res => {
        this.courses = res;
        this.cd.detectChanges();
      });
  }

  // ------- Course Methods -------
 
onCoursePdfSelected(event: any) {
  if (event.target.files && event.target.files.length > 0) {
    this.selectedCoursePdf = event.target.files[0];
  }
}


 createCourse() {
  const formData = new FormData();
  formData.append('CourseName', this.newCourse.courseName);
  formData.append('Description', this.newCourse.description);
  formData.append('Category', this.newCourse.category);
  formData.append('CreatedByTeacherId', this.teacherId.toString());

  if (this.selectedCoursePdf) {
    formData.append('PdfFile', this.selectedCoursePdf);
  }

  this.http.post<any>(`https://localhost:7072/api/Teacher/CreateCourse`, formData)
    .subscribe(res => {
      alert(res.message);
      this.newCourse = { courseName: '', description: '', category: '', createdByTeacherId: this.teacherId };
      this.selectedCoursePdf = null;
      this.loadCourses();
    }, err => {
      console.error('Create course error:', err);
    });
}

  updateCourse(course: any) {
    this.http.put<any>(`https://localhost:7072/api/Teacher/UpdateCourse`, course)
      .subscribe(res => {
        alert(res.message);
        this.loadCourses();
      });
  }

  deleteCourse(courseId: number) {
    this.http.delete<any>(`https://localhost:7072/api/Teacher/DeleteCourse/${courseId}/${this.teacherId}`)
      .subscribe(res => {
        alert(res.message);
        this.loadCourses();
      });
  }

  // ------- Assignment Methods -------
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  createAssignment() {
    const formData = new FormData();
    formData.append('courseId', this.newAssignment.courseId?.toString() || '');
    formData.append('teacherId', this.newAssignment.teacherId.toString());
    formData.append('title', this.newAssignment.title);
    formData.append('description', this.newAssignment.description);
    formData.append('dueDate', this.newAssignment.dueDate);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }

    this.http.post<any>(`https://localhost:7072/api/Teacher/CreateAssignment`, formData)
      .subscribe(res => {
        alert(res.message);
        this.newAssignment = {
          courseId: null,
          teacherId: this.teacherId,
          title: '',
          description: '',
          uploadFilePath: '',
          dueDate: ''
        };
        this.selectedFile = null;
        this.loadSubmittedAssignments();
      });
  }

loadCreatedAssignments() {
  this.http.get<any[]>(`https://localhost:7072/api/Teacher/MyAssignments/${this.teacherId}`)
    .subscribe(res => {
      this.assignments = res;
    });
}

  assignAssignmentToStudenta() {
    const { studentId, assignmentId } = this.assignAssignmentData;
    this.http.post<any>(`https://localhost:7072/api/Teacher/AssignAssignmentToStudent?assignmentId=${assignmentId}&studentId=${studentId}`, {})
      .subscribe(res => {
        alert(res.message);
        this.assignAssignmentData = { studentId: null, assignmentId: null };
        this.loadSubmittedAssignments();
      });
  }

  viewSubmissions(assignmentId: number) {
    this.http.get<any[]>(`https://localhost:7072/api/Teacher/Submissions/${assignmentId}`)
      .subscribe(res => {
        this.submissions = res;
        this.cd.detectChanges();
      });
  }

  loadSubmittedAssignments() {
    this.http.get<any[]>(`https://localhost:7072/api/Teacher/SubmittedAssignments/${this.teacherId}`)
      .subscribe({
        next: res => {
          this.submissions = res;
          this.cd.detectChanges();
        },
        error: err => {
          console.error("❌ Failed to load submissions", err);
          alert("Failed to load submissions.");
        }
      });
  }

  gradeSubmission(sub: any) {
    this.http.put<any>(`https://localhost:7072/api/Teacher/GradeSubmission`, sub)
      .subscribe(res => {
        alert(res.message);
        this.viewSubmissions(sub.assignmentId);
      });
  }

  // ------- Performance Methods -------
  loadPerformanceReports() {
    this.http.get<any[]>(`https://localhost:7072/api/Admin/StudentPerformance`)
      .subscribe(res => {
        this.performanceReports = res;
        this.cd.detectChanges();
      });
  }

  createPerformance() {
    this.http.post<any>(`https://localhost:7072/api/Teacher/CreatePerformance`, this.newPerformance)
      .subscribe(res => {
        alert(res.message);
        this.newPerformance = { studentId: null, courseId: null, averageGrade: null, remarks: '' };
        this.loadPerformanceReports();
      });
  }

  updatePerformance(report: any) {
    this.http.put<any>(`https://localhost:7072/api/Teacher/UpdatePerformance`, report)
      .subscribe(res => {
        alert(res.message);
        this.loadPerformanceReports();
      });
  }

  // ------- Enrollment Methods -------
  assignCourseToStudent() {
    const { studentId, courseId } = this.assignCourseData;
    this.http.post<any>(`https://localhost:7072/api/Teacher/AssignCourseToStudent?studentId=${studentId}&courseId=${courseId}`, {})
      .subscribe(res => {
        alert(res.message);
        this.assignCourseData = { studentId: null, courseId: null };
        this.loadEnrolledStudents();
      });
  }

loadEnrolledStudents() {
  this.http.get<any[]>(`https://localhost:7072/api/Teacher/ApprovedStudents`)
    .subscribe({
      next: res => {
        this.enrolledStudents = res;
        console.log("✅ Approved Students:", res);  // Debug
        this.cd.detectChanges();
      },
      error: err => {
        console.error("❌ Failed to load approved students", err);
        alert("Failed to load approved students.");
      }
    });
}

logout() {
  localStorage.removeItem('teacherId'); // or however you're storing the login
  this.router.navigate(['/']); // go to home or login page
}
}
