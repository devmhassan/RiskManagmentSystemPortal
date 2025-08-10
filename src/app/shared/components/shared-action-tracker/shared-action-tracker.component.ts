import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionItem, ActionStatusSummary } from '../../../action-tracker/models/action.interface';
import { ActionItemDto } from '../../../proxy/risk-managment-system/risks/dtos/models';
import { ActionPriority } from '../../../proxy/risk-managment-system/domain/shared/enums/action-priority.enum';

@Component({
  selector: 'app-shared-action-tracker',
  templateUrl: './shared-action-tracker.component.html',
  styleUrls: ['./shared-action-tracker.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SharedActionTrackerComponent implements OnInit, OnChanges {
  @Input() isDashboard: boolean = true;
  @Input() showTitle: boolean = false;
  @Input() showSummaryCards: boolean = false;
  @Input() maxItems: number = 10;
  @Input() upcomingActions: ActionItemDto[] = [];
  @Input() overdueActions: ActionItemDto[] = [];
  @Input() openActions: ActionItemDto[] = [];
  @Input() inProgressActions: ActionItemDto[] = [];
  @Input() completedActions: ActionItemDto[] = [];
  @Input() actionTrackerStats: any = {
    openActionsCount: 0,
    inProgressActionsCount: 0,
    completedActionsCount: 0,
    overdueActionsCount: 0
  };
  @Input() isLoading: boolean = false;
  @Input() error: string | null = null;

  activeTab: 'all' | 'upcoming' | 'overdue' | 'completed' = 'all';
  searchQuery = '';

  get statusSummary(): ActionStatusSummary {
    return {
      open: this.actionTrackerStats.openActionsCount,
      inProgress: this.actionTrackerStats.inProgressActionsCount,
      completed: this.actionTrackerStats.completedActionsCount,
      overdue: this.actionTrackerStats.overdueActionsCount
    };
  }

  allActions: ActionItemDto[] = [];
  filteredActions: ActionItemDto[] = [];
  displayedActions: ActionItemDto[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
   
    this.initializeActions();
  }

  ngOnChanges(): void {
    this.initializeActions();
  }

  private initializeActions(): void {
    // Combine all action arrays
    this.allActions = [
      ...this.openActions,
      ...this.upcomingActions,
      ...this.inProgressActions,
      ...this.completedActions,
      ...this.overdueActions
    ];

    // Remove duplicates based on actionId
    const uniqueActionsMap = new Map<string, ActionItemDto>();
    this.allActions.forEach(action => {
      if (action.actionId) {
        uniqueActionsMap.set(action.actionId, action);
      }
    });
    this.allActions = Array.from(uniqueActionsMap.values());
    this.filterActions();
  }

  filterActions(): void {
    let filtered = [...this.allActions];

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

    // Filter by active tab
    if (this.activeTab === 'upcoming') {
      // Show actions that are open and not overdue
      filtered = filtered.filter(action =>
        this.getActionStatus(action) === 'open' && (!action.daysOverdue || action.daysOverdue <= 0)
      );
    } else if (this.activeTab === 'overdue') {
      filtered = filtered.filter(action => this.getActionStatus(action) === 'overdue');
    } else if (this.activeTab === 'completed') {
      filtered = filtered.filter(action => this.getActionStatus(action) === 'completed');
    }
    // 'all' shows everything

    this.filteredActions = filtered;

    if (this.isDashboard && this.maxItems) {
      this.displayedActions = this.filteredActions.slice(0, this.maxItems);
    } else {
      this.displayedActions = this.filteredActions;
    }
  }

  private getActionStatus(action: ActionItemDto): string {
    // First check if action is overdue (takes priority)
    if (action.daysOverdue && action.daysOverdue > 0) {
      return 'overdue';
    }

    // Then check the status field from the API
    // Based on your API response: status: 1 appears to be "open"
    if (action.status) {
      switch (action.status) {
        case 1: return 'open';          // Open/Active
        case 2: return 'progress';      // In Progress  
        case 3: return 'completed';     // Completed
        case 4: return 'overdue';       // Overdue
        default: return 'open';
      }
    }

    return 'open'; // Default status
  }

  setActiveTab(tab: 'all' | 'upcoming' | 'overdue' | 'completed'): void {
    this.activeTab = tab;
    this.filterActions();
  }

  onSearchChange(): void {
    this.filterActions();
  }

  getStatusClass(action: ActionItemDto): string {
    const status = this.getActionStatus(action);
    switch (status) {
      case 'completed': return 'completed';
      case 'overdue': return 'overdue';
      case 'upcoming': return 'open';
      default: return 'open';
    }
  }

  getPriorityClass(priority?: ActionPriority): string {
    if (!priority) return 'medium';

    switch (priority) {
      case ActionPriority.High:
      case ActionPriority.Urgent:
      case ActionPriority.Immediate:
        return 'high';
      case ActionPriority.Medium:
        return 'medium';
      case ActionPriority.Low:
        return 'low';
      default:
        return 'medium';
    }
  }

  isOverdue(action: ActionItemDto): boolean {
    return action.daysOverdue ? action.daysOverdue > 0 : false;
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

  getStatusDisplayText(action: ActionItemDto): string {
    const status = this.getActionStatus(action);
    switch (status) {
      case 'completed': return 'Completed';
      case 'overdue': return 'Overdue';
      case 'progress': return 'In progress';
      case 'open': return 'Open';
      default: return 'Open';
    }
  }

  viewAction(action: ActionItemDto): void {
    this.router.navigate(['/action-tracker/view', action.actionId]);
  }
}
