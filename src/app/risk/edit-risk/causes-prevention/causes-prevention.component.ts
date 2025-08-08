import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Risk, RiskCause, PreventiveAction } from '../../models/risk.interface';

@Component({
  selector: 'app-causes-prevention',
  templateUrl: './causes-prevention.component.html',
  styleUrls: ['./causes-prevention.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CausesPreventionComponent {
  @Input() risk: Risk | null = null;
  @Output() riskUpdated = new EventEmitter<Risk>();

  updateRisk(): void {
    if (this.risk) {
      this.riskUpdated.emit(this.risk);
    }
  }

  addCause(): void {
    if (this.risk) {
      const newCause: RiskCause = {
        id: 'C' + (Date.now()),
        name: '',
        likelihood: 'L3',
        priority: 'medium',
        preventiveActions: []
      };
      if (!this.risk.causes) {
        this.risk.causes = [];
      }
      this.risk.causes.push(newCause);
      this.updateRisk();
    }
  }

  removeCause(causeId: string): void {
    if (this.risk && this.risk.causes) {
      this.risk.causes = this.risk.causes.filter(cause => cause.id !== causeId);
      this.updateRisk();
    }
  }

  addAction(causeId: string): void {
    if (this.risk && this.risk.causes) {
      const cause = this.risk.causes.find(c => c.id === causeId);
      if (cause) {
        const newAction: PreventiveAction = {
          id: 'PA' + (Date.now()),
          name: '',
          cost: 0,
          priority: 'medium',
          status: 'open',
          assignedTo: '',
          dueDate: ''
        };
        cause.preventiveActions.push(newAction);
        this.updateRisk();
      }
    }
  }

  removeAction(causeId: string, actionId: string): void {
    if (this.risk && this.risk.causes) {
      const cause = this.risk.causes.find(c => c.id === causeId);
      if (cause) {
        cause.preventiveActions = cause.preventiveActions.filter(action => action.id !== actionId);
        this.updateRisk();
      }
    }
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'highest': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'primary';
      case 'open': return 'warning';
      case 'disabled': return 'secondary';
      default: return 'secondary';
    }
  }
}
