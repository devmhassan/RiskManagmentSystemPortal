import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Risk, RiskConsequence, MitigationAction } from '../../models/risk.interface';

@Component({
  selector: 'app-consequences-mitigation',
  templateUrl: './consequences-mitigation.component.html',
  styleUrls: ['./consequences-mitigation.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ConsequencesMitigationComponent {
  @Input() risk: Risk | null = null;
  @Output() riskUpdated = new EventEmitter<Risk>();

  updateRisk(): void {
    if (this.risk) {
      this.riskUpdated.emit(this.risk);
    }
  }

  addConsequence(): void {
    if (this.risk) {
      const newConsequence: RiskConsequence = {
        id: 'CON' + (Date.now()),
        name: '',
        severity: 'S3',
        cost: 0,
        priority: 'medium',
        mitigationActions: []
      };
      if (!this.risk.consequences) {
        this.risk.consequences = [];
      }
      this.risk.consequences.push(newConsequence);
      this.updateRisk();
    }
  }

  removeConsequence(consequenceId: string): void {
    if (this.risk && this.risk.consequences) {
      this.risk.consequences = this.risk.consequences.filter(consequence => consequence.id !== consequenceId);
      this.updateRisk();
    }
  }

  addAction(consequenceId: string): void {
    if (this.risk && this.risk.consequences) {
      const consequence = this.risk.consequences.find(c => c.id === consequenceId);
      if (consequence) {
        const newAction: MitigationAction = {
          id: 'MA' + (Date.now()),
          name: '',
          cost: 0,
          priority: 'medium',
          status: 'open',
          assignedTo: '',
          dueDate: ''
        };
        consequence.mitigationActions.push(newAction);
        this.updateRisk();
      }
    }
  }

  removeAction(consequenceId: string, actionId: string): void {
    if (this.risk && this.risk.consequences) {
      const consequence = this.risk.consequences.find(c => c.id === consequenceId);
      if (consequence) {
        consequence.mitigationActions = consequence.mitigationActions.filter(action => action.id !== actionId);
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

  getSeverityBadgeClass(severity: string): string {
    switch (severity) {
      case 'S5': return 'danger';
      case 'S4': return 'warning';
      case 'S3': return 'info';
      case 'S2': return 'success';
      case 'S1': return 'secondary';
      default: return 'secondary';
    }
  }
}
