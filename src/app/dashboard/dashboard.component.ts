import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SharedRiskMatrixComponent } from '../shared/components/shared-risk-matrix/shared-risk-matrix.component';
import { SharedRiskListComponent } from '../shared/components/shared-risk-list/shared-risk-list.component';
import { SharedActionTrackerComponent } from '../shared/components/shared-action-tracker/shared-action-tracker.component';
import { Risk } from '../risk/models/risk.interface';
import { RiskService } from '../proxy/risk-managment-system/risks/risk.service';
import { DashboardStatsDto, ActionTrackerStatsDto, ActionItemDto, RiskDto } from '../proxy/risk-managment-system/risks/dtos/models';
import { ActionPriority } from '../proxy/risk-managment-system/domain/shared/enums/action-priority.enum';
import { RiskStatus } from '../proxy/risk-managment-system/domain/shared/enums/risk-status.enum';
import { Likelihood } from '../proxy/risk-managment-system/domain/shared/enums/likelihood.enum';
import { Severity } from '../proxy/risk-managment-system/domain/shared/enums/severity.enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedRiskMatrixComponent, SharedRiskListComponent, SharedActionTrackerComponent]
})
export class DashboardComponent implements OnInit {
  activeTab: 'overview' | 'risks' | 'actions' = 'overview';
  activeActionTab: 'upcoming' | 'overdue' = 'upcoming';

  // Overview data - will be populated from backend
  overviewStats = {
    totalRisks: 0,
    totalRisksChange: '+0 since last month',
    highRisks: 0,
    highRisksChange: '+0 since last month',
    openActions: 0,
    openActionsChange: '+0 since last month',
    mitigatedRisks: 0,
    mitigatedRisksChange: '+0 since last month'
  };

  loading = false;
  error: string | null = null;
  
  // Risks data - will be populated from backend
  risksLoading = false;
  risksError: string | null = null;
  risks: Risk[] = [];

  // Action tracker data - will be populated from backend
  actionTrackerStats = {
    openActionsCount: 0,
    inProgressActionsCount: 0,
    completedActionsCount: 0,
    overdueActionsCount: 0
  };

  upcomingActions: ActionItemDto[] = [];
  overdueActions: ActionItemDto[] = [];
  openActions: ActionItemDto[] = [];
  inProgressActions: ActionItemDto[] = [];
  completedActions: ActionItemDto[] = [];

  constructor(private router: Router, private riskService: RiskService) {
    // Initialize with demo data until API loads
    this.initializeDemoData();
  }

  ngOnInit(): void {
    this.loadDashboardStats();
    this.loadActionTrackerStats();
    this.loadRisks();
  }

  private initializeDemoData(): void {
    // Only set demo stats, let the API provide the actual actions
    this.actionTrackerStats = {
      openActionsCount: 2,
      inProgressActionsCount: 0,
      completedActionsCount: 0,
      overdueActionsCount: 2
    };

    // Clear demo action arrays - use real API data
    this.upcomingActions = [];
    this.overdueActions = [];
    this.openActions = [];
    this.inProgressActions = [];
    this.completedActions = [];
  }

  private loadDashboardStats(): void {
    this.loading = true;
    this.error = null;
    
    this.riskService.getDashboardStats().subscribe({
      next: (stats: DashboardStatsDto) => {
        this.updateOverviewStats(stats);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.error = 'Failed to load dashboard statistics. Please try again later.';
        this.loading = false;
        // Keep default values on error
      }
    });
  }

  private loadActionTrackerStats(): void {
    this.riskService.getActionTrackerStats().subscribe({
      next: (stats: ActionTrackerStatsDto) => {
        this.updateActionTrackerStats(stats);
      },
      error: (error) => {
        console.error('Error loading action tracker stats:', error);
        // Keep default values on error
      }
    });
  }

  private loadRisks(): void {
    this.risksLoading = true;
    this.risksError = null;
    
    this.riskService.getList().subscribe({
      next: (risks: RiskDto[]) => {
        this.risks = this.mapRiskDtoToRisk(risks);
        this.risksLoading = false;
      },
      error: (error) => {
        console.error('Error loading risks:', error);
        this.risksError = 'Failed to load risks. Please try again later.';
        this.risksLoading = false;
        // Keep empty arrays on error
        this.risks = [];
      }
    });
  }

  private updateOverviewStats(stats: DashboardStatsDto): void {
    this.overviewStats = {
      totalRisks: stats.totalRisks,
      totalRisksChange: this.formatChange(stats.totalRisksChange, 'since last month'),
      highRisks: stats.highRisks,
      highRisksChange: this.formatChange(stats.highRisksChange, 'since last month'),
      openActions: stats.openActions,
      openActionsChange: this.formatChange(stats.openActionsChange, 'since last month'),
      mitigatedRisks: stats.mitigatedRisks,
      mitigatedRisksChange: this.formatChange(stats.mitigatedRisksChange, 'since last month')
    };
  }

  private updateActionTrackerStats(stats: ActionTrackerStatsDto): void {
    this.actionTrackerStats = {
      openActionsCount: stats.openActionsCount,
      inProgressActionsCount: stats.inProgressActionsCount,
      completedActionsCount: stats.completedActionsCount,
      overdueActionsCount: stats.overdueActionsCount
    };
    
    // Map all action arrays from the API response
    this.openActions = stats.openActions || [];
    this.inProgressActions = stats.inProgressActions || [];
    this.completedActions = stats.completedActions || [];
    this.overdueActions = stats.overdueActions || [];
    this.upcomingActions = stats.upcomingActions || [];
  }

  private formatChange(change: number, period: string): string {
    const prefix = change >= 0 ? '+' : '';
    return `${prefix}${change} ${period}`;
  }

  private mapRiskDtoToRisk(riskDtos: RiskDto[]): Risk[] {
    return riskDtos.map(dto => this.convertRiskDtoToRisk(dto));
  }

  private convertRiskDtoToRisk(dto: RiskDto): Risk {
    return {
      id: dto.id,
      riskId: dto.riskId || `RISK-${dto.id}`,
      description: dto.description || 'No description',
      likelihood: this.getLikelihoodCode(dto.residualLikelihood || dto.initialLikelihood),
      severity: this.getSeverityCode(dto.residualSeverity || dto.initialSeverity),
      riskLevel: this.getRiskLevelText(dto.residualRiskLevel || dto.initialRiskLevel),
      riskLevelColor: this.getRiskLevelColor(dto.residualRiskLevel || dto.initialRiskLevel),
      riskScore: dto.residualRiskLevel || dto.initialRiskLevel,
      owner: dto.riskOwner || 'Unassigned',
      status: dto.status || RiskStatus.Identified,
      statusColor: this.getRiskStatusColor(dto.status),
      reviewDate: dto.reviewDate ? new Date(dto.reviewDate).toISOString().split('T')[0] : ''
    };
  }

  private getLikelihoodCode(likelihood?: Likelihood): string {
    if (!likelihood) return 'L1';
    return `L${likelihood}`;
  }

  private getSeverityCode(severity?: Severity): string {
    if (!severity) return 'S1';
    return `S${severity}`;
  }

  private getRiskLevelText(riskLevel: number): string {
    if (riskLevel >= 20) return 'Critical';
    if (riskLevel >= 12) return 'High';
    if (riskLevel >= 6) return 'Medium';
    return 'Low';
  }

  private getRiskLevelColor(riskLevel: number): 'critical' | 'high' | 'medium' | 'low' {
    if (riskLevel >= 20) return 'critical';
    if (riskLevel >= 12) return 'high';
    if (riskLevel >= 6) return 'medium';
    return 'low';
  }

  private getRiskStatusText(status?: RiskStatus): string {
    if (!status) return 'Unknown';
    
    switch (status) {
      case RiskStatus.Identified:
        return 'Identified';
      case RiskStatus.UnderAssessment:
        return 'Under Assessment';
      case RiskStatus.Assessed:
        return 'Assessed';
      case RiskStatus.Mitigating:
        return 'Mitigating';
      case RiskStatus.Mitigated:
        return 'Mitigated';
      case RiskStatus.Closed:
        return 'Closed';
      case RiskStatus.Reopened:
        return 'Reopened';
      default:
        return String(status);
    }
  }

  private getRiskStatusColor(status?: RiskStatus): 'identified' | 'under-assessment' | 'assessed' | 'mitigating' | 'mitigated' | 'closed' | 'reopened' {
    if (!status) return 'identified';
    
    switch (status) {
      case RiskStatus.Identified:
        return 'identified';
      case RiskStatus.UnderAssessment:
        return 'under-assessment';
      case RiskStatus.Assessed:
        return 'assessed';
      case RiskStatus.Mitigating:
        return 'mitigating';
      case RiskStatus.Mitigated:
        return 'mitigated';
      case RiskStatus.Closed:
        return 'closed';
      case RiskStatus.Reopened:
        return 'reopened';
      default:
        return 'identified';
    }
  }

  retryLoadStats(): void {
    this.loadDashboardStats();
    this.loadActionTrackerStats();
  }

  retryLoadRisks(): void {
    this.loadRisks();
  }

  setActiveTab(tab: 'overview' | 'risks' | 'actions'): void {
    this.activeTab = tab;
    
    // Load risks data when risks tab is activated (for matrix in overview tab)
    if (tab === 'risks' && this.risks.length === 0 && !this.risksLoading) {
      this.loadRisks();
    }
  }

  setActiveActionTab(tab: 'upcoming' | 'overdue'): void {
    this.activeActionTab = tab;
  }

  get currentActions(): ActionItemDto[] {
    // Map the data correctly based on what the API provides
    if (this.activeActionTab === 'upcoming') {
      // Use openActions for upcoming since that's what has non-overdue actions
      return this.openActions.filter(action => !action.daysOverdue || action.daysOverdue <= 0);
    } else {
      // Use overdueActions for overdue
      return this.overdueActions;
    }
  }

  getUpcomingCount(): number {
    return this.openActions.filter(action => !action.daysOverdue || action.daysOverdue <= 0).length;
  }

  formatActionDate(dateString?: string): string {
    if (!dateString) return 'No due date';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString; // Return original string if parsing fails
    }
  }

  getPriorityDisplayText(priority?: ActionPriority): string {
    if (!priority) return '';
    
    switch (priority) {
      case ActionPriority.Low:
        return 'Low';
      case ActionPriority.Medium:
        return 'Medium';
      case ActionPriority.High:
        return 'High';
      case ActionPriority.Urgent:
        return 'Urgent';
      case ActionPriority.Immediate:
        return 'Immediate';
      default:
        return String(priority);
    }
  }

  getPriorityCssClass(priority?: ActionPriority): string {
    if (!priority) return '';
    
    switch (priority) {
      case ActionPriority.Low:
        return 'priority-low';
      case ActionPriority.Medium:
        return 'priority-medium';
      case ActionPriority.High:
        return 'priority-high';
      case ActionPriority.Urgent:
        return 'priority-urgent';
      case ActionPriority.Immediate:
        return 'priority-immediate';
      default:
        return '';
    }
  }

  getActionStatusClass(action: ActionItemDto): string {
    // Determine status based on daysOverdue and completion status
    if (action.daysOverdue && action.daysOverdue > 0) {
      return 'action-status-overdue';
    }
    
    // If not overdue, consider it open/upcoming
    return 'action-status-open';
  }

  onMatrixCellClick(event: any): void {
    // Handle matrix cell click - could navigate to risk details or filter
    console.log('Matrix cell clicked:', event);
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
