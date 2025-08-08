import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActionItem, ActionStatusSummary } from './models/action.interface';

@Component({
  selector: 'app-action-tracker',
  templateUrl: './action-tracker.component.html',
  styleUrls: ['./action-tracker.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ActionTrackerComponent implements OnInit {
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
      createdDate: new Date('2023-11-01'),
      riskId: 'RISK-001',
      riskTitle: 'Data breach due to unauthorized access',
      daysOverdue: 590
    },
    {
      id: 'ACT-004',
      title: 'Incident response plan',
      description: 'Develop and test incident response procedures',
      status: 'open',
      priority: 'medium',
      assignedTo: 'Emily Davis',
      dueDate: new Date('2023-12-31'),
      createdDate: new Date('2023-11-10'),
      riskId: 'RISK-001',
      riskTitle: 'Data breach due to unauthorized access',
      daysOverdue: 584
    },
    {
      id: 'ACT-005',
      title: 'Infrastructure redundancy',
      description: 'Implement backup systems and redundancy measures',
      status: 'overdue',
      priority: 'critical',
      assignedTo: 'Robert Wilson',
      dueDate: new Date('2023-11-10'),
      createdDate: new Date('2023-09-01'),
      riskId: 'RISK-002',
      riskTitle: 'System downtime during peak hours',
      daysOverdue: 635
    },
    {
      id: 'ACT-006',
      title: 'Backup systems',
      description: 'Implement automated backup systems',
      status: 'completed',
      priority: 'high',
      assignedTo: 'Robert Wilson',
      dueDate: new Date('2023-10-15'),
      createdDate: new Date('2023-09-01'),
      completedDate: new Date('2023-10-15'),
      riskId: 'RISK-002',
      riskTitle: 'System downtime during peak hours'
    }
  ];

  filteredActions: ActionItem[] = [];

  ngOnInit() {
    this.filterActions();
  }

  setActiveTab(tab: 'all' | 'upcoming' | 'overdue' | 'completed') {
    this.activeTab = tab;
    this.filterActions();
  }

  filterActions() {
    let filtered = this.mockActions;

    // Filter by tab
    switch (this.activeTab) {
      case 'upcoming':
        filtered = filtered.filter(action => 
          action.status === 'open' || action.status === 'in-progress'
        );
        break;
      case 'overdue':
        filtered = filtered.filter(action => action.status === 'overdue');
        break;
      case 'completed':
        filtered = filtered.filter(action => action.status === 'completed');
        break;
      // 'all' shows everything
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(action =>
        action.title.toLowerCase().includes(query) ||
        action.description.toLowerCase().includes(query) ||
        action.id.toLowerCase().includes(query) ||
        action.assignedTo.toLowerCase().includes(query)
      );
    }

    this.filteredActions = filtered;
  }

  onSearchChange() {
    this.filterActions();
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'open': return 'status-badge open';
      case 'in-progress': return 'status-badge in-progress';
      case 'completed': return 'status-badge completed';
      case 'overdue': return 'status-badge overdue';
      default: return 'status-badge';
    }
  }

  getBootstrapStatusBadgeClass(status: string): string {
    switch (status) {
      case 'open': return 'badge bg-primary';
      case 'in-progress': return 'badge bg-warning';
      case 'completed': return 'badge bg-success';
      case 'overdue': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

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

  getOverdueText(action: ActionItem): string {
    if (action.daysOverdue) {
      return `(${action.daysOverdue} days overdue)`;
    }
    return '';
  }
}
