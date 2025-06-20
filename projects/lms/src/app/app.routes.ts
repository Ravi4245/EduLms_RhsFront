import { Routes } from '@angular/router';
import { Home } from '../Home/home/home';
import { StudentRegisterComponent } from '../Register/student-register.component/student-register.component';
import { TeacherRegisterComponent } from '../Register/teacher-register.component/teacher-register.component';
import { LoginComponent } from '../Register/login.component/login.component';
import { AdminDashboardComponent } from './Dashboard/admin-dashboard.component/admin-dashboard.component';
import { TeacherDashboardComponent } from './Dashboard/teacher-dashboard.component/teacher-dashboard.component';
import { StudentDashboardComponent } from './Dashboard/student-dashboard.component/student-dashboard.component';
import { AuthGuard } from './auth-guard';
import { FeatureDetailComponent } from './feature-detail/feature-detail';
import { StudentPerformanceChartComponent } from './Dashboard/student-performance-chart/student-performance-chart';



export const routes: Routes = [
  { path: '', component: Home },
{ path: 'feature-details/:type', component: FeatureDetailComponent },
{ path: 'performance-chart', component: StudentPerformanceChartComponent },



  { path: 'student-register', component: StudentRegisterComponent },
  { path: 'teacher-register', component: TeacherRegisterComponent },
  { path: 'login', component: LoginComponent },

  // ✅ Protected dashboard routes
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'teacher-dashboard',
    component: TeacherDashboardComponent,
    
  },
  {
    path: 'student-dashboard',
    component: StudentDashboardComponent,
    
  },

  // ✅ Optional fallback route
  { path: '**', redirectTo: '' }
];
