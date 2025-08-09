import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SharedRiskListComponent } from '../shared/components/shared-risk-list/shared-risk-list.component';
import { SharedActionTrackerComponent } from '../shared/components/shared-action-tracker/shared-action-tracker.component';
import { SharedRiskMatrixComponent } from '../shared/components/shared-risk-matrix/shared-risk-matrix.component';
import { Risk } from '../risk/models/risk.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedRiskListComponent, SharedActionTrackerComponent, SharedRiskMatrixComponent]
})
export class DashboardComponent {
  activeTab: 'overview' | 'risks' | 'actions' = 'overview';

  // Overview data
  overviewStats = {
    totalRisks: 24,
    totalRisksChange: '+2 since last month',
    highRisks: 7,
    highRisksChange: '-1 since last month',
    openActions: 16,
    openActionsChange: '+3 since last month',
    mitigatedRisks: 5,
    mitigatedRisksChange: '+2 since last month'
  };

  // Sample risk data for matrix
  risks: Risk[] = [
    {
      id: 'RISK-001',
      description: 'Data breach due to unauthorized access',
      likelihood: 'L5',
      severity: 'S5',
      riskLevel: 'Critical',
      riskLevelColor: 'critical',
      riskScore: 25,
      owner: 'Security Team',
      status: 'Open',
      statusColor: 'open',
      reviewDate: '2023-12-15'
    },
    {
      id: 'RISK-002',
      description: 'System downtime during peak hours',
      likelihood: 'L4',
      severity: 'S4',
      riskLevel: 'Critical',
      riskLevelColor: 'critical',
      riskScore: 16,
      owner: 'IT Operations',
      status: 'Mitigated',
      statusColor: 'mitigated',
      reviewDate: '2023-11-30'
    },
    {
      id: 'RISK-003',
      description: 'Compliance violation in financial reporting',
      likelihood: 'L4',
      severity: 'S5',
      riskLevel: 'Critical',
      riskLevelColor: 'critical',
      riskScore: 20,
      owner: 'Finance Department',
      status: 'Closed',
      statusColor: 'closed',
      reviewDate: '2023-10-15'
    },
    {
      id: 'RISK-004',
      description: 'Supply chain disruption',
      likelihood: 'L3',
      severity: 'S4',
      riskLevel: 'High',
      riskLevelColor: 'high',
      riskScore: 12,
      owner: 'Procurement',
      status: 'Open',
      statusColor: 'open',
      reviewDate: '2023-12-20'
    },
    {
      id: 'RISK-005',
      description: 'Product quality defects',
      likelihood: 'L2',
      severity: 'S4',
      riskLevel: 'Medium',
      riskLevelColor: 'medium',
      riskScore: 8,
      owner: 'Quality Assurance',
      status: 'Mitigated',
      statusColor: 'mitigated',
      reviewDate: '2023-11-10'
    }
  ];

  // Action tracker data
  upcomingActions = [
    {
      title: 'Infrastructure redundancy',
      dueDate: '11/10/2023 (637 days overdue)',
      isOverdue: true
    }
  ];

  constructor(private router: Router) {}

  setActiveTab(tab: 'overview' | 'risks' | 'actions'): void {
    this.activeTab = tab;
  }

  viewAllActions(): void {
    this.router.navigate(['/action-tracker']);
  }

  navigateToRisks(): void {
    this.router.navigate(['/risk']);
  }

  navigateToActions(): void {
    this.router.navigate(['/action-tracker']);
  }
}
