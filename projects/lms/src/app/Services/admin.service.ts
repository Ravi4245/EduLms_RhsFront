import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Student {
  studentId: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
}

export interface Teacher {
  teacherId: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'https://localhost:7072/api/Admin';

  constructor(private http: HttpClient) {}

  getApprovedStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/ApprovedStudents`);
  }

  getApprovedTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.baseUrl}/ApprovedTeachers`);
  }
}
