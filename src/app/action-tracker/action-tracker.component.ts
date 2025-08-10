import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedActionTrackerComponent } from '../shared/components/shared-action-tracker/shared-action-tracker.component';
import { ActionItem, ActionStatusSummary } from './models/action.interface';
import { RiskService } from '../proxy/risk-managment-system/risks/risk.service';
import { ActionTrackerStatsDto, ActionItemDto } from '../proxy/risk-managment-system/risks/dtos/models';
import { ActionPriority } from '../proxy/risk-managment-system/domain/shared/enums/action-priority.enum';

@Component({
  selector: 'app-action-tracker',
  templateUrl: './action-tracker.component.html',
  styleUrls: ['./action-tracker.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, SharedActionTrackerComponent]
})
export class ActionTrackerComponent implements OnInit {
  activeTab: 'all' | 'upcoming' | 'overdue' | 'completed' | 'open' | 'in-progress' = 'all';
  searchQuery = '';
  loading = false;
  error: string | null = null;
  
  // Backend data
  actionTrackerStats = {
    openActionsCount: 0,
    inProgressActionsCount: 0,
    completedActionsCount: 0,
    overdueActionsCount: 0,

  };

  upcomingActions: ActionItemDto[] = [];
  overdueActions: ActionItemDto[] = [];
  openActions: ActionItemDto[] = [];
  inProgressActions: ActionItemDto[] = [];
  completedActions: ActionItemDto[] = [];
  allActions: ActionItemDto[] = [];
  filteredActions: ActionItemDto[] = [];

  // Computed status summary from backend data
  get statusSummary(): ActionStatusSummary {
    return {
      open: this.actionTrackerStats.openActionsCount,
      inProgress: this.actionTrackerStats.inProgressActionsCount,
      completed: this.actionTrackerStats.completedActionsCount,
      overdue: this.actionTrackerStats.overdueActionsCount,
    };
  }

  constructor(private riskService: RiskService, private router: Router) {}

  ngOnInit() {
    this.loadActionTrackerStats();
  }

  loadActionTrackerStats(): void {
    this.loading = true;
    this.error = null;
    
    this.riskService.getActionTrackerStats().subscribe({
      next: (stats: ActionTrackerStatsDto) => {
        debugger;
        this.updateActionTrackerStats(stats);
        this.filterActions();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading action tracker stats:', error);
        this.error = 'Failed to load action tracker data. Please try again later.';
        this.loading = false;
      }
    });
  }

  private updateActionTrackerStats(stats: ActionTrackerStatsDto): void {
    this.actionTrackerStats = {
      openActionsCount: stats.openActionsCount,
      inProgressActionsCount: stats.inProgressActionsCount,
      completedActionsCount: stats.completedActionsCount,
      overdueActionsCount: stats.overdueActionsCount
    };
    
    this.upcomingActions = stats.upcomingActions || [];
    this.overdueActions = stats.overdueActions || [];
    this.openActions = stats.openActions || [];
    this.inProgressActions = stats.inProgressActions || [];
    this.completedActions = stats.completedActions || [];

    // Combine all actions for filtering
    this.allActions = [...this.upcomingActions, ...this.overdueActions, ...this.openActions, ...this.inProgressActions, ...this.completedActions];
  }

  setActiveTab(tab: 'all' | 'upcoming' | 'overdue' | 'completed' | 'open' | 'in-progress') {
    this.activeTab = tab;
    this.filterActions();
  }

  filterActions() {
    let filtered = this.allActions;

    // Filter by tab
    switch (this.activeTab) {
      case 'upcoming':
        filtered = this.upcomingActions;
        break;
      case 'overdue':
        filtered = this.overdueActions;
        break;
      case 'open':
        filtered = this.openActions;
        break;
      case 'in-progress':
        filtered = this.inProgressActions;
        break;
      case 'completed':
        // Filter completed actions from all actions
        filtered = this.allActions.filter(action => 
          this.getActionStatus(action) === 'completed'
        );
        break;
      // 'all' shows everything
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(action =>
        (action.description || '').toLowerCase().includes(query) ||
        (action.actionId || '').toLowerCase().includes(query) ||
        (action.assignedTo || '').toLowerCase().includes(query) ||
        (action.riskDescription || '').toLowerCase().includes(query)
      );
    }

    this.filteredActions = filtered;
  }

  private getActionStatus(action: ActionItemDto): string {
    if (action.daysOverdue > 0) return 'overdue';
    // This is a simplified status mapping - you might want to enhance this
    // based on your actual action status logic
    return 'upcoming';
  }

  onSearchChange() {
    this.filterActions();
  }

  retryLoad(): void {
    this.loadActionTrackerStats();
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

  getStatusBadgeClass(action: ActionItemDto): string {
    const status = this.getActionStatus(action);
    switch (status) {
      case 'open': return 'status-badge open';
      case 'in-progress': return 'status-badge in-progress';
      case 'completed': return 'status-badge completed';
      case 'overdue': return 'status-badge overdue';
      default: return 'status-badge';
    }
  }

  getBootstrapStatusBadgeClass(action: ActionItemDto): string {
    const status = this.getActionStatus(action);
    switch (status) {
      case 'open': return 'badge bg-primary';
      case 'in-progress': return 'badge bg-warning';
      case 'completed': return 'badge bg-success';
      case 'overdue': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  // Legacy methods for backward compatibility with old priority strings
  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'low': return 'priority-badge low';
      case 'medium': return 'priority-badge medium';
      case 'high': return 'priority-badge high';
      case 'critical': return 'priority-badge critical';
      default: return 'priority-badge';
    }
  }

  getBootstrapPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'low': return 'badge bg-success-subtle text-success';
      case 'medium': return 'badge bg-warning-subtle text-warning';
      case 'high': return 'badge bg-danger-subtle text-danger';
      case 'critical': return 'badge bg-danger text-white';
      default: return 'badge bg-secondary';
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getOverdueText(action: ActionItemDto): string {
    if (action.daysOverdue && action.daysOverdue > 0) {
      return `(${action.daysOverdue} days overdue)`;
    }
    return '';
  }

  getActionDisplayStatus(action: ActionItemDto): string {
    const status = this.getActionStatus(action);
    switch (status) {
      case 'open': return 'Open';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'overdue': return 'Overdue';
      default: return 'Unknown';
    }
  }

  viewAction(action: ActionItemDto): void {
    this.router.navigate(['/action-tracker/view', action.actionId]);
  }
}
