import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentDashboardService {
  private baseUrl = 'https://localhost:7072/api/Student';
  private teacherUrl = 'https://localhost:7072/api/Teacher';

  constructor(private http: HttpClient) {}

  getProfile(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Profile/${studentId}`);
  }

  getMyCourses(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/MyCourses/${studentId}`);
  }

  getEnrolledCourses(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/EnrolledCourses/${studentId}`);
  }

  enrollCourse(studentId: number, courseId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Enroll?studentId=${studentId}&courseId=${courseId}`, {});
  }

  getAssignments(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/MyAssignments/${studentId}`);
  }

  submitAssignment(assignmentId: number, studentId: number, formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/SubmitAssignment?assignmentId=${assignmentId}&studentId=${studentId}`, formData);
  }

  getPerformanceReports(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/PerformanceReport/${studentId}`);
  }

  getAssignedAssignments(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.teacherUrl}/StudentAssignments/${studentId}`);
  }
}
