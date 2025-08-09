import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RiskOverviewComponent } from './components/risk-overview/risk-overview.component';
import { RiskTrendsComponent } from './components/risk-trends/risk-trends.component';
import { ActionStatusComponent } from './components/action-status/action-status.component';
import { DepartmentPerformanceComponent } from './components/department-performance/department-performance.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RiskOverviewComponent,
    RiskTrendsComponent,
    ActionStatusComponent,
    DepartmentPerformanceComponent
  ]
})
export class ReportsComponent {
  selectedReport: string = 'Risk Overview';
  timeFrame: string = 'Last 30 Days';
  businessUnit: string = 'All Business Units';

  reportOptions = [
    { value: 'Risk Overview', label: 'Risk Overview' },
    { value: 'Risk Trends', label: 'Risk Trends' },
    { value: 'Action Status', label: 'Action Status' },
    { value: 'Department Performance', label: 'Department Performance' }
  ];

  timeFrameOptions = [
    { value: 'Last 7 Days', label: 'Last 7 Days' },
    { value: 'Last 30 Days', label: 'Last 30 Days' },
    { value: 'Last 90 Days', label: 'Last 90 Days' },
    { value: 'Last 6 Months', label: 'Last 6 Months' },
    { value: 'Last Year', label: 'Last Year' }
  ];

  businessUnitOptions = [
    { value: 'All Business Units', label: 'All Business Units' },
    { value: 'IT Department', label: 'IT Department' },
    { value: 'Security', label: 'Security' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Human Resources', label: 'Human Resources' }
  ];

  onReportChange(report: string): void {
    this.selectedReport = report;
  }

  onTimeFrameChange(timeFrame: string): void {
    this.timeFrame = timeFrame;
  }

  onBusinessUnitChange(businessUnit: string): void {
    this.businessUnit = businessUnit;
  }

  exportReport(): void {
    // Implement export functionality
    console.log('Exporting report:', this.selectedReport);
  }
}
