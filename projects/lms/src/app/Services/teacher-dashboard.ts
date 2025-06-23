import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherDashboardService {
  private baseUrl = 'https://localhost:7072/api/Teacher';
  private adminUrl = 'https://localhost:7072/api/Admin';

  constructor(private http: HttpClient) {}

  // ✅ Profile
  getTeacherProfile(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Profile/${id}`);
  }

  // ✅ Courses
  getCourses(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/MyCourses/${id}`);
  }

  createCourse(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/CreateCourse`, formData);
  }

  updateCourse(course: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateCourse`, course);
  }

  deleteCourse(courseId: number, teacherId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeleteCourse/${courseId}/${teacherId}`);
  }

  // ✅ Assignments
  getAssignments(teacherId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/MyAssignments/${teacherId}`);
  }

  createAssignment(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/CreateAssignment`, formData);
  }

  updateAssignment(id: number, assignment: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateAssignment/${id}`, assignment);
  }

  deleteAssignment(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeleteAssignment/${id}`);
  }

  // ✅ Performance
  getPerformanceReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.adminUrl}/StudentPerformance`);
  }

  createPerformance(report: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/CreatePerformance`, report);
  }

  updatePerformance(report: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdatePerformance`, report);
  }

  deletePerformance(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeletePerformance/${id}`);
  }

  // ✅ Submissions
  getSubmittedAssignments(teacherId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/SubmittedAssignments/${teacherId}`);
  }

  viewSubmissions(assignmentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Submissions/${assignmentId}`);
  }

  gradeSubmission(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/GradeSubmission`, data);
  }

  // ✅ Enrollments
  getApprovedStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ApprovedStudents`);
  }

  assignCourse(studentId: number, courseId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/AssignCourseToStudent?studentId=${studentId}&courseId=${courseId}`, {});
  }

  assignAssignment(studentId: number, assignmentId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/AssignAssignmentToStudent?assignmentId=${assignmentId}&studentId=${studentId}`, {});
  }

  // ✅ Assigned Students
  getStudentsByCourse(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/AssignedStudentsByCourse/${courseId}`);
  }

  getStudentsByAssignment(assignmentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/AssignedStudentsByAssignment/${assignmentId}`);
  }
}
