import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Risk } from '../../models/risk.interface';

@Component({
  selector: 'app-risk-analysis',
  templateUrl: './risk-analysis.component.html',
  styleUrls: ['./risk-analysis.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class RiskAnalysisComponent {
  @Input() risk: Risk | null = null;

  // Calculate total implementation cost for preventive actions
  getTotalPreventiveCost(): number {
    if (!this.risk?.causes) return 0;
    
    return this.risk.causes.reduce((total, cause) => {
      return total + cause.preventiveActions.reduce((actionTotal, action) => {
        return actionTotal + (action.cost || 0);
      }, 0);
    }, 0);
  }

  // Calculate total implementation cost for mitigation actions
  getTotalMitigationCost(): number {
    if (!this.risk?.consequences) return 0;
    
    return this.risk.consequences.reduce((total, consequence) => {
      return total + consequence.mitigationActions.reduce((actionTotal, action) => {
        return actionTotal + (action.cost || 0);
      }, 0);
    }, 0);
  }

  // Calculate total implementation cost
  getTotalImplementationCost(): number {
    return this.getTotalPreventiveCost() + this.getTotalMitigationCost();
  }

  // Calculate potential consequence costs
  getPotentialConsequenceCosts(): Array<{severity: string, id: string, cost: number}> {
    if (!this.risk?.consequences) return [];
    
    return this.risk.consequences.map(consequence => ({
      severity: consequence.severity,
      id: consequence.id,
      cost: consequence.cost || 0
    }));
  }

  // Calculate total potential consequence cost
  getTotalPotentialCost(): number {
    return this.getPotentialConsequenceCosts().reduce((total, item) => total + item.cost, 0);
  }

  // Calculate net benefit
  getNetBenefit(): number {
    return this.getTotalPotentialCost() - this.getTotalImplementationCost();
  }

  // Get cost-effectiveness assessment
  getCostEffectivenessText(): string {
    const netBenefit = this.getNetBenefit();
    if (netBenefit > 0) {
      return 'The potential cost of consequences exceeds the implementation costs, suggesting the controls are cost-effective.';
    } else {
      return 'The implementation costs exceed the potential consequence costs. Consider reviewing control priorities.';
    }
  }

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Get severity badge class
  getSeverityBadgeClass(severity: string): string {
    switch (severity.toLowerCase()) {
      case 's5':
      case 'critical':
        return 'danger';
      case 's4':
      case 'high':
        return 'warning';
      case 's3':
      case 'medium':
        return 'info';
      case 's2':
      case 'low':
        return 'secondary';
      case 's1':
      case 'very low':
        return 'light';
      default:
        return 'secondary';
    }
  }
}
