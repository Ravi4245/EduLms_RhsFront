import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { ChartType, ChartConfiguration } from 'chart.js/auto';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-student-performance-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],

  templateUrl: './student-performance-chart.html',
  styleUrls: ['./student-performance-chart.css']
})
export class StudentPerformanceChartComponent implements OnInit {
  studentId!: number;
  isBrowser: boolean;
  isLoading: boolean = false;

  pieChartType: ChartType = 'pie';
  pieChartLabels: string[] = ['Excellent', 'Very Good', 'Good', 'Average', 'Poor'];

  pieChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: []
  };

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: '📊 Grade Breakdown',
        font: {
          size: 18,
          weight: 'bold'
        }
      }
    }
  };

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    console.log('📌 Chart component loaded');

    if (this.isBrowser) {
      const storedId = localStorage.getItem('studentId');
      if (storedId) {
        this.studentId = +storedId;
        this.loadPieData();
      } else {
        console.error('❌ Student ID not found in localStorage. Please log in.');
      }
    }
  }

  loadPieData(): void {
    this.isLoading = true;

    this.http.get<any[]>(`https://localhost:7072/api/Student/PerformanceReport/${this.studentId}`)
      .subscribe(data => {
        console.log('📊 API Data:', data);

        let excellent = 0, veryGood = 0, good = 0, average = 0, poor = 0;

        data.forEach(item => {
          const score = typeof item.grade === 'string'
            ? this.mapGradeToScore(item.grade)
            : Number(item.grade);

          if (score >= 90) excellent++;
          else if (score >= 80) veryGood++;
          else if (score >= 70) good++;
          else if (score >= 60) average++;
          else poor++;
        });

        this.pieChartData = {
          labels: [...this.pieChartLabels],
          datasets: [{
            data: [excellent, veryGood, good, average, poor],
            backgroundColor: ['#28a745', '#ffc107', '#17a2b8', '#fd7e14', '#dc3545']
          }]
        };

        this.isLoading = false;
      }, error => {
        console.error('❌ Error loading chart data:', error);
        this.isLoading = false;
      });
  }

  mapGradeToScore(grade: string): number {
    switch (grade.toUpperCase()) {
      case 'A': return 90;
      case 'B': return 80;
      case 'C': return 70;
      case 'D': return 60;
      default: return 50;
    }
  }
}


