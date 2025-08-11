import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionDetailsDto } from '../../../../proxy/risk-managment-system/risks/dtos/models';
import { ActionType } from '../../../../proxy/risk-managment-system/domain/shared/enums/action-type.enum';

@Component({
  selector: 'app-action-details',
  templateUrl: './action-details.component.html',
  styleUrls: ['./action-details.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ActionDetailsComponent {
  @Input() action: ActionDetailsDto | null = null;

  getBootstrapStatusBadgeClass(action: ActionDetailsDto): string {
    if (action.daysOverdue && action.daysOverdue > 0) {
      return 'bg-danger';
    }
    
    switch (action.status) {
      case 3: return 'bg-success'; // Completed
      case 2: return 'bg-warning'; // In Progress
      case 4: return 'bg-danger';  // Overdue
      case 1: return 'bg-primary'; // Open
      default: return 'bg-secondary';
    }
  }

  getActionDisplayStatus(action: ActionDetailsDto): string {
    if (action.daysOverdue && action.daysOverdue > 0) {
      return 'Overdue';
    }
    
    switch (action.status) {
      case 1: return 'Open';
      case 2: return 'In Progress';
      case 3: return 'Completed';
      case 4: return 'Overdue';
      default: return 'Unknown';
    }
  }

  getActionTypeText(type?: ActionType): string {
    switch (type) {
      case ActionType.Preventive: return 'Preventive';
      case ActionType.Mitigation: return 'Mitigation';
      default: return 'Unknown';
    }
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

  formatCurrency(amount?: number): string {
    if (amount === undefined || amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }

  getCostVariance(): { amount: number; text: string; class: string } {
    if (!this.action?.cost || !this.action?.actualCost) {
      return { amount: 0, text: 'N/A', class: 'text-muted' };
    }

    const variance = this.action.actualCost - this.action.cost;
    const formattedVariance = this.formatCurrency(Math.abs(variance));
    
    if (variance < 0) {
      return {
        amount: variance,
        text: `-${formattedVariance} (Under budget)`,
        class: 'text-success'
      };
    } else if (variance > 0) {
      return {
        amount: variance,
        text: `+${formattedVariance} (Over budget)`,
        class: 'text-danger'
      };
    } else {
      return {
        amount: 0,
        text: 'On budget',
        class: 'text-primary'
      };
    }
  }
}
