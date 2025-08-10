import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionItemDto } from '../../proxy/risk-managment-system/risks/dtos/models';
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
  action: ActionItemDto | null = null;
  actionId: string | null = null;
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
    
    // For now, we'll create a mock action based on the ID
    // In a real implementation, you would fetch this from your service
    this.action = this.createMockAction(actionId);
    this.loading = false;
    
    // Uncomment this when you have a real service method to fetch action by ID
    // this.riskService.getActionById(actionId).subscribe({
    //   next: (action) => {
    //     this.action = action;
    //     this.loading = false;
    //   },
    //   error: (error) => {
    //     console.error('Error loading action:', error);
    //     this.error = 'Failed to load action data';
    //     this.loading = false;
    //   }
    // });
  }

  private createMockAction(actionId: string): ActionItemDto {
    // Mock action data for demonstration
    return {
      actionId: actionId,
      description: 'Implement strong password requirements',
      riskDescription: 'Weak password policy increases security risks',
      riskId: 'RISK-001',
      assignedTo: 'John Smith',
      dueDate: '2023-11-15',
      status: 1, // Assuming this maps to completed
      priority: 2, // Assuming this maps to high
      daysOverdue: 0
    } as ActionItemDto;
  }

  setActiveTab(tab: 'details' | 'comments' | 'attachments'): void {
    this.activeTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/action-tracker']);
  }

  getTabBadgeCount(tab: 'details' | 'comments' | 'attachments'): number {
    switch (tab) {
      case 'comments':
        return 3; // Mock count from the image
      case 'attachments':
        return 2; // Mock count from the image
      default:
        return 0;
    }
  }
}
