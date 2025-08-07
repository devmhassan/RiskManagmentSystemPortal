export interface ActionItem {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  dueDate: Date;
  createdDate: Date;
  completedDate?: Date;
  riskId?: string;
  riskTitle?: string;
  cost?: number;
  daysOverdue?: number;
}

export interface ActionStatusSummary {
  open: number;
  inProgress: number;
  completed: number;
  overdue: number;
}
