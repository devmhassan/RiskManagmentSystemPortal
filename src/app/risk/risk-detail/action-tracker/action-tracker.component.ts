import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Risk, PreventiveAction, MitigationAction } from '../../models/risk.interface';

interface ActionItem {
  id: string;
  name: string;
  type: 'Preventive' | 'Mitigation';
  relatedTo: string;
  assignedTo: string;
  dueDate: string;
  status: 'completed' | 'in-progress' | 'open' | 'disabled';
  priority: 'highest' | 'high' | 'medium' | 'low';
  cost: number;
  isOverdue: boolean;
}

interface ReassignData {
  actionId: string;
  description: string;
  assignedTo: string;
  businessUnit: string;
  priority: string;
  estimatedCost: number;
  startDate: string;
  dueDate: string;
  comments: string;
}

@Component({
  selector: 'app-action-tracker',
  templateUrl: './action-tracker.component.html',
  styleUrls: ['./action-tracker.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ActionTrackerComponent {
  @Input() risk: Risk | null = null;

  // Modal state
  showReassignModal: boolean = false;
  
  // Form data for reassignment
  reassignData: ReassignData = {
    actionId: '',
    description: '',
    assignedTo: '',
    businessUnit: '',
    priority: 'medium',
    estimatedCost: 0,
    startDate: '',
    dueDate: '',
    comments: ''
  };

  // Team members and business units
  teamMembers = [
    'John Smith',
    'Sarah Johnson', 
    'Michael Chen',
    'Emily Rodriguez',
    'David Wilson',
    'Amanda Brown',
    'Robert Taylor',
    'Jessica Lee'
  ];

  businessUnits = [
    'IT Security',
    'Risk Management',
    'Compliance',
    'Operations',
    'Legal',
    'Human Resources'
  ];

  // Get all actions combined
  getAllActions(): ActionItem[] {
    if (!this.risk) return [];

    const actions: ActionItem[] = [];
    const currentDate = new Date();

    // Add preventive actions
    this.risk.causes?.forEach(cause => {
      cause.preventiveActions.forEach(action => {
        const dueDate = new Date(action.dueDate);
        actions.push({
          id: action.id,
          name: action.name,
          type: 'Preventive',
          relatedTo: `Cause: ${cause.name}`,
          assignedTo: action.assignedTo,
          dueDate: action.dueDate,
          status: action.status,
          priority: action.priority,
          cost: action.cost,
          isOverdue: dueDate < currentDate && action.status !== 'completed'
        });
      });
    });

    // Add mitigation actions
    this.risk.consequences?.forEach(consequence => {
      consequence.mitigationActions.forEach(action => {
        const dueDate = new Date(action.dueDate);
        actions.push({
          id: action.id,
          name: action.name,
          type: 'Mitigation',
          relatedTo: `Consequence: ${consequence.name}`,
          assignedTo: action.assignedTo,
          dueDate: action.dueDate,
          status: action.status,
          priority: action.priority,
          cost: action.cost,
          isOverdue: dueDate < currentDate && action.status !== 'completed'
        });
      });
    });

    return actions;
  }

  // Get actions by status
  getActionsByStatus(status: string): ActionItem[] {
    return this.getAllActions().filter(action => action.status === status);
  }

  // Get overdue actions
  getOverdueActions(): ActionItem[] {
    return this.getAllActions().filter(action => action.isOverdue);
  }

  // Get completion percentage
  getCompletionPercentage(): number {
    const allActions = this.getAllActions();
    if (allActions.length === 0) return 0;
    
    const completedActions = allActions.filter(action => action.status === 'completed').length;
    return Math.round((completedActions / allActions.length) * 100);
  }

  // Get status badge class
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'open':
        return 'primary';
      case 'disabled':
        return 'secondary';
      default:
        return 'secondary';
    }
  }

  // Get priority badge class
  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'highest':
        return 'danger';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  }

  // Get type badge class
  getTypeBadgeClass(type: string): string {
    return type === 'Preventive' ? 'primary' : 'info';
  }

  // Format date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  }

  // Check if action is overdue
  isActionOverdue(action: ActionItem): boolean {
    return action.isOverdue;
  }

  // Reassign action
  reassignAction(actionId: string): void {
    const action = this.getAllActions().find(a => a.id === actionId);
    if (action) {
      this.reassignData = {
        actionId: actionId,
        description: action.name,
        assignedTo: action.assignedTo,
        businessUnit: '',
        priority: action.priority,
        estimatedCost: action.cost,
        startDate: this.formatDateForInput(new Date()),
        dueDate: this.formatDateForInput(new Date(action.dueDate)),
        comments: ''
      };
      this.showReassignModal = true;
    }
  }

  // Close reassign modal
  closeReassignModal(): void {
    this.showReassignModal = false;
    this.resetReassignData();
  }

  // Save reassignment
  saveReassignment(): void {
    if (!this.reassignData.assignedTo || !this.reassignData.businessUnit) {
      return; // Validation failed
    }

    // Update the action in the risk data
    this.updateActionInRisk(this.reassignData.actionId, {
      assignedTo: this.reassignData.assignedTo,
      priority: this.reassignData.priority as any,
      cost: this.reassignData.estimatedCost,
      dueDate: this.reassignData.dueDate,
      name: this.reassignData.description
    });

    this.closeReassignModal();
  }

  // Reset reassign data
  private resetReassignData(): void {
    this.reassignData = {
      actionId: '',
      description: '',
      assignedTo: '',
      businessUnit: '',
      priority: 'medium',
      estimatedCost: 0,
      startDate: '',
      dueDate: '',
      comments: ''
    };
  }

  // Complete action
  completeAction(actionId: string): void {
    this.updateActionStatus(actionId, 'completed');
  }

  // Handle action select dropdown
  handleActionSelect(actionId: string, action: string): void {
    if (!action) return; // No action selected
    
    switch (action) {
      case 'reassign':
        this.reassignAction(actionId);
        break;
      case 'complete':
        this.completeAction(actionId);
        break;
      case 'view':
        // Could implement view details functionality
        console.log('View details for action:', actionId);
        break;
    }
    
    // Reset the select to default value
    setTimeout(() => {
      const selectElement = document.querySelector(`select.action-select[value="${action}"]`) as HTMLSelectElement;
      if (selectElement) {
        selectElement.value = '';
      }
    }, 100);
  }

  // Update action status
  updateActionStatus(actionId: string, newStatus: string): void {
    if (!this.risk) return;

    // Update in preventive actions
    this.risk.causes?.forEach(cause => {
      const action = cause.preventiveActions.find(a => a.id === actionId);
      if (action) {
        action.status = newStatus as any;
      }
    });

    // Update in mitigation actions
    this.risk.consequences?.forEach(consequence => {
      const action = consequence.mitigationActions.find(a => a.id === actionId);
      if (action) {
        action.status = newStatus as any;
      }
    });
  }

  // Update action in risk data
  private updateActionInRisk(actionId: string, updates: Partial<any>): void {
    if (!this.risk) return;

    // Update in preventive actions
    this.risk.causes?.forEach(cause => {
      const action = cause.preventiveActions.find(a => a.id === actionId);
      if (action) {
        Object.assign(action, updates);
      }
    });

    // Update in mitigation actions
    this.risk.consequences?.forEach(consequence => {
      const action = consequence.mitigationActions.find(a => a.id === actionId);
      if (action) {
        Object.assign(action, updates);
      }
    });
  }

  // Format date for input field
  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Track by function for ngFor performance
  trackByActionId(index: number, action: ActionItem): string {
    return action.id;
  }

  // Get total preventive actions count
  getTotalPreventiveActions(): number {
    return this.getAllActions().filter(action => action.type === 'Preventive').length;
  }

  // Get total mitigation actions count
  getTotalMitigationActions(): number {
    return this.getAllActions().filter(action => action.type === 'Mitigation').length;
  }

  // Get on track actions count
  getOnTrackActions(): number {
    return this.getAllActions().filter(action => !action.isOverdue).length;
  }
}
