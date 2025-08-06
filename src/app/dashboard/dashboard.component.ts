import { Component, OnInit } from '@angular/core';
import { RiskService } from '../proxy/risk-managment-system/risks/risk.service';
import { DashboardStatsDto } from '../proxy/risk-managment-system/risks/dtos/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dashboardStats: DashboardStatsDto | null = null;
  loading = true;
  activeTab = 'overview';
  Math = Math; // Make Math available in template

  constructor(private riskService: RiskService) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.loading = true;
    this.riskService.getDashboardStats().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.loading = false;
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getChangeClass(change: number): string {
    if (change > 0) return 'positive-change';
    if (change < 0) return 'negative-change';
    return 'no-change';
  }

  getChangeIcon(change: number): string {
    if (change > 0) return '↗';
    if (change < 0) return '↘';
    return '→';
  }
}
