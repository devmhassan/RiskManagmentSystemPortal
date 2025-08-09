import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionItem, ActionStatusSummary } from '../../../action-tracker/models/action.interface';

@Component({
  selector: 'app-shared-action-tracker',
  templateUrl: './shared-action-tracker.component.html',
  styleUrls: ['./shared-action-tracker.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SharedActionTrackerComponent implements OnInit {
  @Input() isDashboard: boolean = true;
  @Input() showTitle: boolean = false;
  @Input() showSummaryCards: boolean = false;
  @Input() maxItems: number = 10;

  activeTab: 'all' | 'upcoming' | 'overdue' | 'completed' = 'all';
  searchQuery = '';

  statusSummary: ActionStatusSummary = {
    open: 2,
    inProgress: 3,
    completed: 2,
    overdue: 1
  };

  mockActions: ActionItem[] = [
    {
      id: 'ACT-001',
      title: 'Implement strong password requirements',
      description: 'Implement strong password requirements for all user accounts',
      status: 'completed',
      priority: 'high',
      assignedTo: 'John Smith',
      dueDate: new Date('2023-11-15'),
      createdDate: new Date('2023-10-01'),
      completedDate: new Date('2023-11-15'),
      riskId: 'RISK-001',
      riskTitle: 'Data breach due to unauthorized access'
    },
    {
      id: 'ACT-002',
      title: 'Regular password rotation',
      description: 'Regular password rotation policy implementation',
      status: 'in-progress',
      priority: 'medium',
      assignedTo: 'Sarah Johnson',
      dueDate: new Date('2023-12-20'),
      createdDate: new Date('2023-10-15'),
      riskId: 'RISK-001',
      riskTitle: 'Data breach due to unauthorized access',
      daysOverdue: 595
    },
    {
      id: 'ACT-003',
      title: 'Implement role-based access control',
      description: 'Implement role-based access control system',
      status: 'in-progress',
      priority: 'high',
      assignedTo: 'Michael Chen',
      dueDate: new Date('2023-12-25'),
      createdDate: new Date('2023-10-20'),
      riskId: 'RISK-001',
      riskTitle: 'Data breach due to unauthorized access',
      daysOverdue: 592
    },
    {
      id: 'ACT-004',
      title: 'Incident response plan',
      description: 'Develop and implement incident response plan',
      status: 'open',
      priority: 'high',
      assignedTo: 'Security Team',
      dueDate: new Date('2024-01-15'),
      createdDate: new Date('2023-11-01'),
      riskId: 'RISK-001',
      riskTitle: 'Data breach due to unauthorized access'
    }
  ];

  filteredActions: ActionItem[] = [];
  displayedActions: ActionItem[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.filterActions();
  }

  filterActions(): void {
    let filtered = [...this.mockActions];

    // Filter by search query
    if (this.searchQuery.trim()) {
      filtered = filtered.filter(action =>
        action.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        action.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        action.assignedTo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        action.id.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    // Filter by active tab
    if (this.activeTab === 'upcoming') {
      filtered = filtered.filter(action => 
        action.status === 'open' || action.status === 'in-progress'
      );
    } else if (this.activeTab === 'overdue') {
      filtered = filtered.filter(action => action.daysOverdue && action.daysOverdue > 0);
    } else if (this.activeTab === 'completed') {
      filtered = filtered.filter(action => action.status === 'completed');
    }

    this.filteredActions = filtered;

    if (this.isDashboard && this.maxItems) {
      this.displayedActions = this.filteredActions.slice(0, this.maxItems);
    } else {
      this.displayedActions = this.filteredActions;
    }
  }

  setActiveTab(tab: 'all' | 'upcoming' | 'overdue' | 'completed'): void {
    this.activeTab = tab;
    this.filterActions();
  }

  onSearchChange(): void {
    this.filterActions();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'completed';
      case 'in-progress': return 'in-progress';
      case 'open': return 'open';
      default: return 'open';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'medium';
    }
  }

  isOverdue(action: ActionItem): boolean {
    return action.daysOverdue ? action.daysOverdue > 0 : false;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  viewAction(action: ActionItem): void {
    // Navigate to action details or implement view logic
    console.log('View action:', action.id);
  }
}
