
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ✅ Interfaces
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

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private api = 'https://localhost:7072/api/Admin';

  constructor(private http: HttpClient) {}

  // Students
  getPendingStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.api}/PendingStudents`);
  }

  getApprovedStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.api}/ApprovedStudents`);
  }

  approveStudent(id: number): Observable<any> {
    return this.http.put(`${this.api}/ApproveStudent/${id}`, {});
  }

  rejectStudent(id: number): Observable<any> {
    return this.http.delete(`${this.api}/RejectStudent/${id}`);
  }

  canDeleteStudent(id: number): Observable<{ canDelete: boolean }> {
    return this.http.get<{ canDelete: boolean }>(`${this.api}/CanDeleteStudent/${id}`);
  }

  deleteApprovedStudent(id: number): Observable<any> {
    return this.http.delete(`${this.api}/DeleteApprovedStudent/${id}`);
  }

  updateStudent(student: Student): Observable<any> {
    return this.http.put(`${this.api}/UpdateStudent/${student.studentId}`, student);
  }

  // Teachers
  getPendingTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.api}/PendingTeachers`);
  }

  getApprovedTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.api}/ApprovedTeachers`);
  }

  approveTeacher(id: number): Observable<any> {
    return this.http.put(`${this.api}/ApproveTeacher/${id}`, {});
  }

  rejectTeacher(id: number): Observable<any> {
    return this.http.delete(`${this.api}/RejectTeacher/${id}`);
  }

  canDeleteTeacher(id: number): Observable<{ canDelete: boolean }> {
    return this.http.get<{ canDelete: boolean }>(`${this.api}/CanDeleteTeacher/${id}`);
  }

  deleteApprovedTeacher(id: number): Observable<any> {
    return this.http.delete(`${this.api}/DeleteApprovedTeacher/${id}`);
  }

  updateTeacher(teacher: Teacher): Observable<any> {
    return this.http.put(`${this.api}/UpdateTeacher/${teacher.teacherId}`, teacher);
  }

  // Courses
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.api}/Courses`);
  }

  canDeleteCourse(id: number): Observable<{ canDelete: boolean }> {
    return this.http.get<{ canDelete: boolean }>(`${this.api}/CanDeleteCourse/${id}`);
  }

  deleteCourse(id: number): Observable<any> {
    return this.http.delete(`${this.api}/DeleteCourse/${id}`);
  }

  updateCourse(course: Course): Observable<any> {
    return this.http.put(`${this.api}/UpdateCourse/${course.courseId}`, course);
  }

  // Reports
  getPerformanceReports(): Observable<PerformanceReport[]> {
    return this.http.get<PerformanceReport[]>(`${this.api}/StudentPerformance`);
  }
}