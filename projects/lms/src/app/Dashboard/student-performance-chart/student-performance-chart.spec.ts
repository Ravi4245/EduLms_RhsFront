import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPerformanceChart } from './student-performance-chart';

describe('StudentPerformanceChart', () => {
  let component: StudentPerformanceChart;
  let fixture: ComponentFixture<StudentPerformanceChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentPerformanceChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentPerformanceChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
