import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface RiskSummary {
  totalRisks: number;
  criticalRisks: number;
  openActions: number;
  completedActions: number;
}

interface RiskDistribution {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

interface BusinessUnitRisk {
  name: string;
  riskCount: number;
  percentage: number;
}

interface RecentRiskChange {
  id: string;
  title: string;
  status: string;
  daysAgo: number;
  severityFrom: number;
  severityTo: number;
}

@Component({
  selector: 'app-risk-overview',
  templateUrl: './risk-overview.component.html',
  styleUrls: ['./risk-overview.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class RiskOverviewComponent {
  @Input() timeFrame: string = 'Last 30 Days';
  @Input() businessUnit: string = 'All Business Units';

  riskSummary: RiskSummary = {
    totalRisks: 24,
    criticalRisks: 5,
    openActions: 18,
    completedActions: 42
  };

  riskDistribution: RiskDistribution = {
    critical: 5,
    high: 8,
    medium: 7,
    low: 4
  };

  businessUnitRisks: BusinessUnitRisk[] = [
    { name: 'IT Department', riskCount: 7, percentage: 87.5 },
    { name: 'Security', riskCount: 6, percentage: 75.0 },
    { name: 'Finance', riskCount: 5, percentage: 62.5 },
    { name: 'Operations', riskCount: 4, percentage: 50.0 },
    { name: 'Human Resources', riskCount: 2, percentage: 25.0 }
  ];

  recentRiskChanges: RecentRiskChange[] = [
    {
      id: 'RISK-001',
      title: 'Data breach due to unauthorized access',
      status: 'Improved',
      daysAgo: 3,
      severityFrom: 20,
      severityTo: 12
    },
    {
      id: 'RISK-003',
      title: 'Compliance violation in financial reporting',
      status: 'Improved',
      daysAgo: 5,
      severityFrom: 16,
      severityTo: 4
    },
    {
      id: 'RISK-005',
      title: 'Product quality defects',
      status: 'Improved',
      daysAgo: 7,
      severityFrom: 15,
      severityTo: 5
    }
  ];

  getRiskDistributionPercentage(value: number): number {
    const total = this.riskDistribution.critical + this.riskDistribution.high + 
                  this.riskDistribution.medium + this.riskDistribution.low;
    return Math.round((value / total) * 100);
  }

  getBusinessUnitWidth(riskCount: number): string {
    const maxRisks = Math.max(...this.businessUnitRisks.map(bu => bu.riskCount));
    return `${(riskCount / maxRisks) * 100}%`;
  }
}
