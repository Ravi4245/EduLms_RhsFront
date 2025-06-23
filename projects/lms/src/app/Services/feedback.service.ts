// src/app/services/feedback.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Feedback {
  email: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'https://localhost:7072/api/Feedback';

  constructor(private http: HttpClient) {}

  submitFeedback(feedback: Feedback): Observable<any> {
    return this.http.post(`${this.apiUrl}/Submit`, feedback);
  }
}
