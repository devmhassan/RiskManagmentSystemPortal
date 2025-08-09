import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DepartmentPerformance {
  name: string;
  completionRate: number;
  actionsCompleted: string;
  risksMitigated: number;
  color: string;
}

interface TopPerformer {
  id: string;
  name: string;
  department: string;
  completionRate: number;
  actionsCompleted: string;
}

@Component({
  selector: 'app-department-performance',
  templateUrl: './department-performance.component.html',
  styleUrls: ['./department-performance.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class DepartmentPerformanceComponent {
  @Input() timeFrame: string = 'Last 30 Days';
  @Input() businessUnit: string = 'All Business Units';

  departmentPerformances: DepartmentPerformance[] = [
    {
      name: 'IT Department',
      completionRate: 85,
      actionsCompleted: '17/20',
      risksMitigated: 3,
      color: 'success'
    },
    {
      name: 'Security',
      completionRate: 90,
      actionsCompleted: '18/20',
      risksMitigated: 4,
      color: 'success'
    },
    {
      name: 'Finance',
      completionRate: 75,
      actionsCompleted: '12/16',
      risksMitigated: 2,
      color: 'success'
    },
    {
      name: 'Operations',
      completionRate: 60,
      actionsCompleted: '9/15',
      risksMitigated: 1,
      color: 'warning'
    },
    {
      name: 'Human Resources',
      completionRate: 80,
      actionsCompleted: '8/10',
      risksMitigated: 1,
      color: 'success'
    }
  ];

  topPerformers: TopPerformer[] = [
    {
      id: 'JS',
      name: 'John Smith',
      department: 'Security Team',
      completionRate: 100,
      actionsCompleted: '8/8'
    },
    {
      id: 'SJ',
      name: 'Sarah Johnson',
      department: 'Finance',
      completionRate: 92,
      actionsCompleted: '11/12'
    },
    {
      id: 'MC',
      name: 'Michael Chen',
      department: 'IT Department',
      completionRate: 85,
      actionsCompleted: '6/7'
    }
  ];

  getPerformanceColor(rate: number): string {
    if (rate >= 80) return 'success';
    if (rate >= 60) return 'warning';
    return 'danger';
  }

  getPerformanceWidth(rate: number): string {
    return `${rate}%`;
  }
}
