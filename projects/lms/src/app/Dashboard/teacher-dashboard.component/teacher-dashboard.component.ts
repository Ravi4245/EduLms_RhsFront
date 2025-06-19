import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Add this interface to avoid TS errors
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

interface Course {
  courseId: number;
  courseName: string;
  category: string;
  pdfFilePath?: string;
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
  activeSection: string = 'profile'; // default section

  selectedFile: File | null = null;

  profile: any = {};  // ✅ NEW profile object

  courses: any[] = [];
  assignments: AssignmentModel[] = [];  // Use interface here
  submissions: any[] = [];
  performanceReports: any[] = [];
  enrolledStudents: any[] = [];
  selectedCoursePdf: File | null = null;
  editingReportId: number | null = null;
 assignedStudentsByCourse: Student[] = [];
assignedStudentsByAssignment: Student[] = [];

  // Pagination for enrolled students
  currentPage: number = 1;
  // Assignment pagination
currentAssignmentPage: number = 1;
assignmentsPerPage: number = 5;
paginatedAssignments: AssignmentModel[] = [];

// Student pagination (for assign-assignment section)
currentStudentPage: number = 1;
studentsPerPage: number = 5;
paginatedStudents: Student[] = [];

  
  itemsPerPage: number = 3;

  editingAssignment: AssignmentModel | null = null;  // Use interface

  newCourse = {
    courseName: '',
    description: '',
    category: '',
    createdByTeacherId: 0
  };


  assignByNameData = {
  studentName: '',
  assignmentTitle: ''
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

  constructor(private http: HttpClient, private cd: ChangeDetectorRef, private router: Router) {}

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


  startEditAssignment(assignment: AssignmentModel) {
    this.editingAssignment = { ...assignment };
  }

  cancelEdit() {
    this.editingAssignment = null;
  }

  viewPdf(path: string) {
    const fullPath = `https://localhost:7072/${path}`;
    window.open(fullPath, '_blank');
  }

  
get paginatedEnrolledStudents() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  return this.enrolledStudents.slice(start, end);
}

get totalPages(): number {
  return Math.ceil(this.enrolledStudents.length / this.itemsPerPage);
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
  .subscribe((res: any[]) => {
    this.courses = res;
    this.cd.detectChanges();
  });

  }

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
        this.loadAssignments();
      });
  }

  updatePaginatedAssignments(): void {
  const start = (this.currentAssignmentPage - 1) * this.assignmentsPerPage;
  const end = start + this.assignmentsPerPage;
  this.paginatedAssignments = this.assignments.slice(start, end);
}

updatePaginatedStudents(): void {
  const start = (this.currentStudentPage - 1) * this.studentsPerPage;
  const end = start + this.studentsPerPage;
  this.paginatedStudents = this.enrolledStudents.slice(start, end);
}


  loadAssignments() {
  this.http.get<AssignmentModel[]>(`https://localhost:7072/api/Teacher/MyAssignments/${this.teacherId}`)
    .subscribe(data => {
      this.assignments = data;
      this.updatePaginatedAssignments(); // ✅
      this.cd.detectChanges();
    }, err => {
      console.error('Failed to load assignments', err);
    });
}


  updateAssignment() {
    if (!this.editingAssignment) return;

    this.http.put<any>(
      `https://localhost:7072/api/Teacher/UpdateAssignment/${this.editingAssignment.assignmentId}`,
      this.editingAssignment
    ).subscribe({
      next: (response) => {
        alert(response.message);
        this.loadAssignments();
        this.editingAssignment = null;
      },
      error: (err) => {
        alert('Failed to update assignment');
        console.error(err);
      }
    });
  }

  editReport(report: any) {
  this.editingReportId = report.performanceReportId;
}

  deleteAssignment(id: number) {
    if (confirm('Are you sure you want to delete this assignment?')) {
      this.http.delete<any>(`https://localhost:7072/api/Teacher/DeleteAssignment/${id}`)
        .subscribe({
          next: (response) => {
            alert(response.message);
            this.loadAssignments();
          },
          error: (err) => {
            alert('Failed to delete assignment');
            console.error(err);
          }
        });
    }
  }

  // ------- Other Methods -------

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
        this.updatePaginatedStudents(); // ✅
        this.cd.detectChanges();
      },
      error: err => {
        console.error("❌ Failed to load approved students", err);
        alert("Failed to load approved students.");
      }
    });
}




  logout() {
    localStorage.removeItem('teacherId');
    this.router.navigate(['/']);
  }

  loadCreatedAssignments() {
  this.http.get<any[]>(`https://localhost:7072/api/Teacher/MyAssignments/${this.teacherId}`)
    .subscribe(res => {
      this.assignments = res;
    });
}





// 🔹 Get Students Assigned to a Specific Course
getAssignedStudentsByCourse(courseId: number) {
  this.http.get<Student[]>(`https://localhost:7072/api/Teacher/AssignedStudentsByCourse/${courseId}`)
    .subscribe({
      next: res => {
        this.assignedStudentsByCourse = res;
        console.log("📘 Students for Course ID", courseId, res);
        this.cd.detectChanges();
      },
      error: err => {
        console.error("❌ Failed to fetch students for course", err);
        alert("Failed to load assigned students for course.");
      }
    });
}

// 🔹 Get Students Assigned to a Specific Assignment
getAssignedStudentsByAssignment(assignmentId: number) {
  this.http.get<Student[]>(`https://localhost:7072/api/Teacher/AssignedStudentsByAssignment/${assignmentId}`)
    .subscribe({
      next: res => {
        this.assignedStudentsByAssignment = res;
        console.log("📄 Students for Assignment ID", assignmentId, res);
        this.cd.detectChanges();
      },
      error: err => {
        console.error("❌ Failed to fetch students for assignment", err);
        alert("Failed to load assigned students for assignment.");
      }
    });
}




}
