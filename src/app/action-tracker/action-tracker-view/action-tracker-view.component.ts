import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionDetailsDto } from '../../proxy/risk-managment-system/risks/dtos/models';
import { ActionType } from '../../proxy/risk-managment-system/domain/shared/enums/action-type.enum';
import { RiskService } from '../../proxy/risk-managment-system/risks/risk.service';
import { ActionDetailsComponent } from './components/action-details/action-details.component';
import { ActionCommentsComponent } from './components/action-comments/action-comments.component';
import { ActionAttachmentsComponent } from './components/action-attachments/action-attachments.component';

@Component({
  selector: 'app-action-tracker-view',
  templateUrl: './action-tracker-view.component.html',
  styleUrls: ['./action-tracker-view.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ActionDetailsComponent,
    ActionCommentsComponent,
    ActionAttachmentsComponent
  ]
})
export class ActionTrackerViewComponent implements OnInit {
  action: ActionDetailsDto | null = null;
  actionId: string | null = null;
  riskId: string | null = null;
  loading = false;
  error: string | null = null;
  
  activeTab: 'details' | 'comments' | 'attachments' = 'details';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private riskService: RiskService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.actionId = params['actionId'];
      this.riskId = params['riskId'];
      if (this.actionId) {
        this.loadActionData(this.actionId);
      } else {
        this.error = 'No action ID provided';
      }
    });
  }

  private loadActionData(actionId: string): void {
    this.loading = true;
    this.error = null;
    
    // Convert actionId to number for the API call
    const actionIdNumber = parseInt(actionId, 10);
    if (isNaN(actionIdNumber)) {
      this.error = 'Invalid action ID format';
      this.loading = false;
      return;
    }
    
    // Try to load action details. We'll first try Preventive, then Mitigation
    this.tryLoadActionWithType(ActionType.Preventive, actionIdNumber);
  }

  private tryLoadActionWithType(actionType: ActionType, actionId: number): void {
    this.riskService.getActionDetails(actionType, actionId).subscribe({
      next: (action) => {
        this.action = action;
        this.loading = false;
        console.log('Action loaded successfully:', action);
      },
      error: (error) => {
        console.error(`Error loading action with type ${actionType}:`, error);
        
        // If Preventive failed, try Mitigation
        if (actionType === ActionType.Preventive) {
          console.log('Trying Mitigation action type...');
          this.tryLoadActionWithType(ActionType.Mitigation, actionId);
        } else {
          // Both types failed
          this.error = `Failed to load action data. Action ${actionId} not found as either Preventive or Mitigation action.`;
          this.loading = false;
        }
      }
    });
  }

  setActiveTab(tab: 'details' | 'comments' | 'attachments'): void {
    this.activeTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/action-tracker']);
  }

  viewRisk(riskId: string): void {
    this.router.navigate(['/risk', riskId]);
  }

  getTabBadgeCount(tab: 'details' | 'comments' | 'attachments'): number {
    if (!this.action) return 0;
    
    switch (tab) {
      case 'comments':
        return this.action.comments?.length || 0;
      case 'attachments':
        return this.action.attachments?.length || 0;
      default:
        return 0;
    }
  }

  getStatusDisplayText(): string {
    if (!this.action?.status) return 'Unknown';
    
    switch (this.action.status) {
      case 1: return 'Open';
      case 2: return 'In Progress';
      case 3: return 'Completed';
      case 4: return 'Overdue';
      default: return 'Unknown';
    }
  }

  getPriorityDisplayText(): string {
    if (!this.action?.priority) return 'Unknown';
    
    switch (this.action.priority) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      case 4: return 'Urgent';
      case 5: return 'Immediate';
      default: return 'Unknown';
    }
  }

  getActionTypeDisplayText(): string {
    if (!this.action?.type) return 'Unknown';
    
    switch (this.action.type) {
      case ActionType.Preventive: return 'Preventive';
      case ActionType.Mitigation: return 'Mitigation';
      default: return 'Unknown';
    }
  }

  getProgressPercentage(): number {
    if (!this.action?.status) return 0;
    
    switch (this.action.status) {
      case 1: return 0;   // Open
      case 2: return 50;  // In Progress
      case 3: return 100; // Completed
      case 4: return 50;  // Overdue (treat as in progress)
      default: return 0;
    }
  }

  getProgressBarClass(): string {
    if (!this.action?.status) return 'bg-secondary';
    
    switch (this.action.status) {
      case 1: return 'bg-secondary';   // Open - gray
      case 2: return 'bg-warning';     // In Progress - yellow
      case 3: return 'bg-success';     // Completed - green
      case 4: return 'bg-danger';      // Overdue - red
      default: return 'bg-secondary';
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'Not set';
    
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
}
