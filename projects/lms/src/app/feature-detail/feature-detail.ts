import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './feature-detail.html',
  styleUrls: ['./feature-detail.css']
})
export class FeatureDetailComponent {
  featureType: string = '';
  featureTitle: string = '';
  featureDesc: string = '';
  featureEmoji: string = '';
  featureBenefits: string[] = [];
  featureVideoUrl: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.featureType = this.route.snapshot.paramMap.get('type') || '';

    switch (this.featureType) {
      case 'goal':
        this.featureEmoji = '🎯';
        this.featureTitle = 'Goal Oriented';
        this.featureDesc = `
EduLMS helps you stay focused with clear learning paths and smart progress tracking.
Whether you're studying for exams, upskilling for your career, or exploring a new subject,
our platform keeps you aligned with your learning objectives through structured modules,
milestones, and gamified achievements.
        `;
        this.featureBenefits = [
          'Clear, structured courses aligned with goals',
          'Progress tracking and certification',
          'Milestone-based gamification'
        ];
        break;

      case 'instructor':
        this.featureEmoji = '🧑‍🏫';
        this.featureTitle = 'Expert Instructors';
        this.featureDesc = `
Our platform features top industry mentors and academic experts with years of experience.
Every instructor goes through a rigorous screening process to ensure high teaching standards.
Benefit from live sessions, doubt-clearing forums, personalized feedback,
and real-world case studies shared directly by professionals.
        `;
        this.featureBenefits = [
          'Industry professionals & academic experts',
          'Interactive live sessions',
          'Personalized doubt solving'
        ];
        break;

      case 'mobile':
        this.featureEmoji = '📱';
        this.featureTitle = 'Mobile Ready';
        this.featureDesc = `
Access your courses anytime, anywhere with our fully responsive and mobile-friendly platform.
Download lectures, view assignments offline, and get real-time push notifications for deadlines and events.
EduLMS ensures learning is never paused, whether you're at home, commuting, or on the go.
        `;
        this.featureBenefits = [
          'Fully responsive design',
          'Offline access to content',
          'Real-time push notifications'
        ];
        break;

      case 'certified':
        this.featureEmoji = '📜';
        this.featureTitle = 'Certified Courses';
        this.featureDesc = `
Get officially recognized for your learning achievements. EduLMS provides verifiable,
shareable certificates that demonstrate your skills and knowledge. Our certifications are
recognized by academic institutions and industry partners to help advance your career.
        `;
        this.featureBenefits = [
          'Verifiable, professional certificates',
          'Recognized by employers and institutions',
          'Boosts resume and career growth'
        ];
        break;

      case 'community':
        this.featureEmoji = '🤝';
        this.featureTitle = 'Supportive Community';
        this.featureDesc = `
Learning is better together. Join our vibrant community of learners and instructors who
actively participate in discussions, resolve doubts, share experiences, and collaborate on projects.
You’ll never feel alone in your learning journey with EduLMS.
        `;
        this.featureBenefits = [
          'Interactive discussion forums',
          'Peer support and mentorship',
          'Collaboration and networking'
        ];
        break;

      case 'tracking':
        this.featureEmoji = '📊';
        this.featureTitle = 'Progress Tracking';
        this.featureDesc = `
Stay on top of your learning with comprehensive analytics and visual dashboards.
Track your completion status, quiz performance, assignment submissions, and more.
EduLMS helps you identify strengths and areas for improvement in real-time.
        `;
        this.featureBenefits = [
          'Visual learning dashboards',
          'Auto-generated progress reports',
          'Goal alignment insights'
        ];
        break;

      case 'affordable':
        this.featureEmoji = '💸';
        this.featureTitle = 'Affordable Plans';
        this.featureDesc = `
Quality education should be accessible to all. EduLMS offers flexible pricing models
with lifetime access, monthly plans, and discounts for students and institutions.
Get premium content and features without breaking the bank.
        `;
        this.featureBenefits = [
          'Budget-friendly plans',
          'Scholarships and discounts available',
          'Lifetime course access options'
        ];
        break;

      case 'secure':
        this.featureEmoji = '🔒';
        this.featureTitle = 'Secure & Private';
        this.featureDesc = `
Your data privacy and security are our top priorities. EduLMS uses state-of-the-art encryption,
multi-factor authentication, and secure servers to protect your personal and learning data.
We strictly adhere to data protection regulations and never sell your information.
        `;
        this.featureBenefits = [
          'Top-tier encryption',
          'GDPR-compliant privacy policies',
          'Safe and secure transactions'
        ];
        break;

      default:
        this.featureTitle = 'Feature Not Found';
        this.featureDesc = 'The requested feature does not exist or has not been added yet.';
        this.featureEmoji = '❓';
        this.featureBenefits = [];
        break;
    }
  }
}
