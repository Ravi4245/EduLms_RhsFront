// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// interface CountResponse {
//   count: number;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AdminService {
//   private baseUrl = 'https://localhost:7072/api/Admin'; // your backend base url

//   constructor(private http: HttpClient) {}

//   getApprovedStudentsCount(): Observable<CountResponse> {
//     return this.http.get<CountResponse>(`${this.baseUrl}/ApprovedStudentsCount`);
//   }

//   getApprovedTeachersCount(): Observable<CountResponse> {
//     return this.http.get<CountResponse>(`${this.baseUrl}/ApprovedTeachersCount`);
//   }
// }
