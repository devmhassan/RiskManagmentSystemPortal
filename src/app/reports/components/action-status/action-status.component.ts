import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ActionSummary {
  open: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

interface OverdueAction {
  id: string;
  title: string;
  dueDate: string;
  daysOverdue: number;
  priority: 'High Priority' | 'Medium Priority';
  priorityClass: string;
}

@Component({
  selector: 'app-action-status',
  templateUrl: './action-status.component.html',
  styleUrls: ['./action-status.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ActionStatusComponent {
  @Input() timeFrame: string = 'Last 30 Days';
  @Input() businessUnit: string = 'All Business Units';

  actionSummary: ActionSummary = {
    open: 18,
    inProgress: 24,
    completed: 42,
    overdue: 8
  };

  overdueActions: OverdueAction[] = [
    {
      id: 'ACT-005',
      title: 'Infrastructure redundancy',
      dueDate: '10 Nov 2023',
      daysOverdue: 20,
      priority: 'High Priority',
      priorityClass: 'danger'
    },
    {
      id: 'ACT-009',
      title: 'Disaster recovery testing',
      dueDate: '15 Nov 2023',
      daysOverdue: 15,
      priority: 'High Priority',
      priorityClass: 'danger'
    },
    {
      id: 'ACT-012',
      title: 'Vendor security assessment',
      dueDate: '20 Nov 2023',
      daysOverdue: 10,
      priority: 'Medium Priority',
      priorityClass: 'warning'
    }
  ];

  getTotalActions(): number {
    return this.actionSummary.open + this.actionSummary.inProgress + 
           this.actionSummary.completed + this.actionSummary.overdue;
  }

  getActionPercentage(count: number): number {
    const total = this.getTotalActions();
    return Math.round((count / total) * 100);
  }
}
