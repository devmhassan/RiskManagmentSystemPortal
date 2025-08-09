import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ImprovedRisk {
  id: string;
  title: string;
  severityFrom: number;
  severityTo: number;
  improvement: number;
}

interface NewRisk {
  id: string;
  title: string;
  addedDaysAgo: number;
  severity: 'High' | 'Medium' | 'Low';
  severityClass: string;
}

@Component({
  selector: 'app-risk-trends',
  templateUrl: './risk-trends.component.html',
  styleUrls: ['./risk-trends.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class RiskTrendsComponent {
  @Input() timeFrame: string = 'Last 30 Days';
  @Input() businessUnit: string = 'All Business Units';

  mostImprovedRisks: ImprovedRisk[] = [
    {
      id: 'RISK-003',
      title: 'Compliance violation in financial reporting',
      severityFrom: 16,
      severityTo: 4,
      improvement: 12
    },
    {
      id: 'RISK-001',
      title: 'Data breach due to unauthorized access',
      severityFrom: 20,
      severityTo: 12,
      improvement: 8
    },
    {
      id: 'RISK-005',
      title: 'Product quality defects',
      severityFrom: 15,
      severityTo: 5,
      improvement: 10
    }
  ];

  newRisks: NewRisk[] = [
    {
      id: 'RISK-006',
      title: 'Third-party vendor security vulnerabilities',
      addedDaysAgo: 2,
      severity: 'High',
      severityClass: 'danger'
    },
    {
      id: 'RISK-007',
      title: 'Remote work security challenges',
      addedDaysAgo: 4,
      severity: 'Medium',
      severityClass: 'warning'
    }
  ];
}
