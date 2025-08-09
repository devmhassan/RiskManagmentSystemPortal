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
  @Input() action!: ActionItemDto;

  formatActionDate(dateString?: string): string {
    if (!dateString) return 'No date set';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  getPriorityDisplayText(priority?: any): string {
    if (!priority) return 'High';
    return String(priority);
  }

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
}
