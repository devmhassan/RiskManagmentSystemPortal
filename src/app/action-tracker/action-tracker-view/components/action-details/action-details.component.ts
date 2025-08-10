import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionItemDto } from '../../../../proxy/risk-managment-system/risks/dtos/models';

@Component({
  selector: 'app-action-details',
  templateUrl: './action-details.component.html',
  styleUrls: ['./action-details.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ActionDetailsComponent {
  @Input() action: ActionItemDto | null = null;

  getBootstrapStatusBadgeClass(action: ActionItemDto): string {
    if (action.daysOverdue && action.daysOverdue > 0) {
      return 'bg-danger';
    }
    return 'bg-success';
  }

  getActionDisplayStatus(action: ActionItemDto): string {
    if (action.daysOverdue && action.daysOverdue > 0) {
      return 'Overdue';
    }
    return 'Completed';
  }

  getPriorityText(priority?: number): string {
    switch (priority) {
      case 0: return 'Low';
      case 1: return 'Medium';
      case 2: return 'High';
      case 3: return 'Critical';
      default: return 'Medium';
    }
  }

  getPriorityBadgeClass(priority?: number): string {
    switch (priority) {
      case 0: return 'bg-success';
      case 1: return 'bg-warning';
      case 2: return 'bg-danger';
      case 3: return 'bg-dark';
      default: return 'bg-warning';
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return dateString;
    }
  }
}
