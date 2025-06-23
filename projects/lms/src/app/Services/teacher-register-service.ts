import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TeacherModel {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  qualification: string;
  experienceYears: number | null;
  specialization: string;
  teacherNO: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeacherRegisterService {
  private apiUrl = 'https://localhost:7072/api/Teacher/RegisterTeacher';

  constructor(private http: HttpClient) {}

  registerTeacher(teacher: TeacherModel): Observable<any> {
    return this.http.post(this.apiUrl, teacher);
  }
}
