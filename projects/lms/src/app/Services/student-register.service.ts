import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StudentModel {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  gradeLevel: string;
  studentNo: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentRegisterService {
  private apiUrl = 'https://localhost:7072/api/Student/RegisterStudent';

  constructor(private http: HttpClient) {}

  registerStudent(student: StudentModel): Observable<any> {
    return this.http.post(this.apiUrl, student);
  }
}
