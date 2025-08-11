import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Risk, RiskDiscussion } from '../models/risk.interface';
import { RiskAnalysisComponent } from './risk-analysis/risk-analysis.component';
import { ActionTrackerComponent } from './action-tracker/action-tracker.component';
import { RiskService } from '../../proxy/risk-managment-system/risks/risk.service';
import { MitigationActionService } from '../../proxy/risk-managment-system/actions/mitigation-action.service';
import { PreventionActionService } from '../../proxy/risk-managment-system/actions/prevention-action.service';
import { RiskCausesService } from '../../proxy/risk-managment-system/risks/risk-causes.service';
import { RiskConsequencesService } from '../../proxy/risk-managment-system/risks/risk-consequences.service';
import { RiskDto, CauseDto, ConsequenceDto, CreateMitigationActionForConsequenceDto, CreatePreventionActionForCauseDto, CreateCauseForRiskDto, CreateConsequenceForRiskDto, UpdateCauseForRiskDto, UpdateConsequenceForRiskDto, UpdateMitigationActionDto, UpdatePreventionActionDto } from '../../proxy/risk-managment-system/risks/dtos/models';
import { ActionStatus, ActionPriority, Likelihood, Severity } from '../../proxy/risk-managment-system/domain/shared/enums';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-risk-detail',
  templateUrl: './risk-detail.component.html',
  styleUrls: ['./risk-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RiskAnalysisComponent, ActionTrackerComponent],
  providers: [
    RiskService,
    MitigationActionService,
    PreventionActionService,
    RiskCausesService,
    RiskConsequencesService
  ]
})
export class RiskDetailComponent implements OnInit {
  id: number = 0;
  riskId: string = '';
  risk: Risk | null = null;
  activeTab: string = 'bowtie';
  isLoading = false;
  loadError: string | null = null;
  newMessage: string = '';
  showReassignModal: boolean = false;
  showLikelihoodModal: boolean = false;
  showPriorityModal: boolean = false;
  showSeverityModal: boolean = false;
  showCostModal: boolean = false;
  showActionCostModal: boolean = false;
  showAddPreventiveActionModal: boolean = false;
  showAddCauseModal: boolean = false;
  showAddMitigationActionModal: boolean = false;
  showAddConsequenceModal: boolean = false;
  isEditMode: boolean = false;
  currentActionId: string = '';
  currentCauseId: string = '';
  currentConsequenceId: string = '';
  currentLikelihood: string = '';
  currentPriority: string = '';
  currentSeverity: string = '';
  currentCost: number = 0;
  currentActionCost: number = 0;
  causesSortDirection: 'asc' | 'desc' = 'desc';
  consequencesSortDirection: 'asc' | 'desc' = 'desc';
  
  // Form data for new items
  newPreventiveAction = {
    description: '',
    estimatedCost: 0,
    priority: 'medium'
  };
  
  newCause = {
    description: '',
    likelihood: '3'
  };
  
  newMitigationAction = {
    description: '',
    estimatedCost: 0,
    priority: 'medium'
  };
  
  newConsequence = {
    description: '',
    severity: '3',
    potentialCost: 0
  };
  
  selectedCauseForAction: string = '';
  selectedConsequenceForAction: string = '';
  
  reassignData = {
    description: '',
    assignedTo: '',
    businessUnit: '',
    priority: 'medium',
    estimatedCost: 0,
    startDate: '',
    dueDate: '',
    comments: ''
  };

  // Mock data - in real app this would come from a service
  mockRisk: Risk = {
    riskId: 'RISK-001',
    id: 1, // Mock integer ID
    description: 'Data breach due to unauthorized access',
    likelihood: 'L5',
    severity: 'S5',
    riskLevel: 'Critical',
    riskLevelColor: 'critical',
    riskScore: 25,
    owner: 'Security Team',
    status: 'Open',
    statusColor: 'open',
    reviewDate: '2023-12-15',
    initialRisk: 'Critical (20)',
    residualRisk: 'High (8)',
    initialRiskColor: 'critical',
    residualRiskColor: 'high',
    causes: [
      {
        id: 'C1',
        name: 'Insufficient security training',
        likelihood: 'L5',
        priority: 'highest',
        preventiveActions: [
          {
            id: 'PA1',
            name: 'Security awareness training',
            cost: 12000,
            priority: 'high',
            status: 'completed',
            assignedTo: 'David Wilson',
            dueDate: '9/15/2023'
          },
          {
            id: 'PA2',
            name: 'Phishing simulations',
            cost: 7500,
            priority: 'medium',
            status: 'in-progress',
            assignedTo: 'David Wilson',
            dueDate: '12/10/2023'
          }
        ]
      },
      {
        id: 'C2',
        name: 'Weak password policies',
        likelihood: 'L4',
        priority: 'high',
        preventiveActions: [
          {
            id: 'PA3',
            name: 'Implement strong password requirements',
            cost: 5000,
            priority: 'high',
            status: 'completed',
            assignedTo: 'John Smith',
            dueDate: '11/15/2023'
          },
          {
            id: 'PA4',
            name: 'Regular password rotation',
            cost: 2000,
            priority: 'medium',
            status: 'in-progress',
            assignedTo: 'Sarah Johnson',
            dueDate: '12/20/2023'
          }
        ]
      },
      {
        id: 'C3',
        name: 'Lack of access controls',
        likelihood: 'L3',
        priority: 'medium',
        preventiveActions: [
          {
            id: 'PA5',
            name: 'Implement role-based access control',
            cost: 15000,
            priority: 'high',
            status: 'completed',
            assignedTo: 'Michael Chen',
            dueDate: '10/30/2023'
          },
          {
            id: 'PA6',
            name: 'Regular access reviews',
            cost: 8000,
            priority: 'medium',
            status: 'open',
            assignedTo: 'Emily Rodriguez',
            dueDate: '1/15/2024'
          }
        ]
      }
    ],
    consequences: [
      {
        id: 'CON1',
        name: 'Reputation damage',
        severity: 'S5',
        cost: 500000,
        priority: 'highest',
        mitigationActions: [
          {
            id: 'MA1',
            name: 'PR crisis management plan',
            cost: 25000,
            priority: 'high',
            status: 'completed',
            assignedTo: 'Robert Taylor',
            dueDate: '9/30/2023'
          },
          {
            id: 'MA2',
            name: 'Transparent communication strategy',
            cost: 15000,
            priority: 'medium',
            status: 'in-progress',
            assignedTo: 'Robert Taylor',
            dueDate: '1/30/2024'
          }
        ]
      },
      {
        id: 'CON2',
        name: 'Regulatory penalties',
        severity: 'S4',
        cost: 250000,
        priority: 'high',
        mitigationActions: [
          {
            id: 'MA3',
            name: 'Compliance documentation',
            cost: 10000,
            priority: 'high',
            status: 'completed',
            assignedTo: 'Jessica Lee',
            dueDate: '11/1/2023'
          },
          {
            id: 'MA4',
            name: 'Regulatory reporting procedures',
            cost: 5000,
            priority: 'medium',
            status: 'completed',
            assignedTo: 'Jessica Lee',
            dueDate: '10/15/2023'
          }
        ]
      },
      {
        id: 'CON3',
        name: 'Customer data exposure',
        severity: 'S3',
        cost: 350000,
        priority: 'high',
        mitigationActions: [
          {
            id: 'MA5',
            name: 'Customer notification procedures',
            cost: 20000,
            priority: 'medium',
            status: 'completed',
            assignedTo: 'Amanda Brown',
            dueDate: '10/20/2023'
          },
          {
            id: 'MA6',
            name: 'Identity protection services',
            cost: 75000,
            priority: 'high',
            status: 'completed',
            assignedTo: 'Amanda Brown',
            dueDate: '11/15/2023'
          }
        ]
      }
    ],
    discussions: [
      {
        id: 'D1',
        author: 'John Smith',
        authorInitials: 'JS',
        message: "I think we should consider adding 'Phishing attacks' as a potential cause.",
        timestamp: '2023-12-07T21:10:00Z',
        time: '12:10 AM'
      },
      {
        id: 'D2',
        author: 'Sarah Johnson',
        authorInitials: 'SJ',
        message: "Good point. We should also add 'Regular phishing simulations' as a preventive control.",
        timestamp: '2023-12-07T22:10:00Z',
        time: '01:10 AM'
      },
      {
        id: 'D3',
        author: 'Michael Chen',
        authorInitials: 'MC',
        message: "What about 'Data encryption at rest and in transit' as a mitigation action?",
        timestamp: '2023-12-07T22:40:00Z',
        time: '01:40 AM'
      }
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private riskService: RiskService,
    private mitigationActionService: MitigationActionService,
    private preventionActionService: PreventionActionService,
    private riskCausesService: RiskCausesService,
    private riskConsequencesService: RiskConsequencesService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.riskId = params['id'];
      this.id = parseInt(params['id'], 10); // Convert string route parameter to number
      this.loadRiskData();
    });
  }

  loadRiskData(): void {
    if (!this.riskId || !this.id) {
      this.loadError = 'No risk ID provided';
      return;
    }

    this.isLoading = true;
    this.loadError = null;

    this.riskService.get(this.id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (riskDto: RiskDto) => {
          console.log('Loaded RiskDto:', riskDto); // Debug log
          console.log('Integer ID:', riskDto.id, 'String RiskId:', riskDto.riskId); // Debug log
          this.risk = this.mapRiskDtoToRisk(riskDto);
          console.log('Mapped Risk:', this.risk); // Debug log
          // Initialize sorting after data is loaded
          this.sortCausesByPriority();
          this.sortConsequencesByPriority();
        },
        error: (error) => {
          console.error('Error loading risk data:', error);
          this.loadError = 'Failed to load risk data. Please try again.';
          // Fallback to mock data for development
          this.loadMockData();
        }
      });
  }

  /**
   * Fallback method for development/testing
   */
  private loadMockData(): void {
    if (this.riskId === 'RISK-001') {
      this.risk = this.mockRisk;
    } else {
      this.risk = { ...this.mockRisk, riskId: this.riskId };
    }
    this.sortCausesByPriority();
    this.sortConsequencesByPriority();
  }

  /**
   * Map backend RiskDto to frontend Risk interface
   */
  private mapRiskDtoToRisk(riskDto: RiskDto): Risk {
    return {
      riskId: riskDto.riskId || '', // String RiskId from backend
      id: riskDto.id, // Integer ID from the database
      description: riskDto.description || '',
      likelihood: this.mapLikelihoodToString(riskDto.initialLikelihood),
      severity: this.mapSeverityToString(riskDto.initialSeverity),
      riskLevel: this.calculateRiskLevel(riskDto.initialLikelihood, riskDto.initialSeverity),
      riskLevelColor: this.getRiskLevelColor(riskDto.initialLikelihood, riskDto.initialSeverity),
      riskScore: riskDto.initialRiskLevel || 0,
      owner: riskDto.riskOwner || '',
      status: this.mapStatusToString(riskDto.status),
      statusColor: this.getStatusColor(riskDto.status),
      reviewDate: riskDto.reviewDate ? new Date(riskDto.reviewDate).toLocaleDateString() : '',
      initialRisk: `${this.calculateRiskLevel(riskDto.initialLikelihood, riskDto.initialSeverity)} (${riskDto.initialRiskLevel})`,
      residualRisk: `${this.calculateRiskLevel(riskDto.residualLikelihood, riskDto.residualSeverity)} (${riskDto.residualRiskLevel})`,
      initialRiskColor: this.getRiskLevelColor(riskDto.initialLikelihood, riskDto.initialSeverity),
      residualRiskColor: this.getRiskLevelColor(riskDto.residualLikelihood, riskDto.residualSeverity),
      causes: this.mapCausesToRiskCauses(riskDto.causes || []),
      consequences: this.mapConsequencesToRiskConsequences(riskDto.consequences || []),
      discussions: [] // Initialize empty discussions array
    };
  }

  /**
   * Map backend causes to frontend format
   */
  private mapCausesToRiskCauses(causes: CauseDto[]): any[] {
    return causes.map(cause => ({
      id: cause.id?.toString() || '',
      name: cause.description || '',
      likelihood: this.mapLikelihoodToString(cause.likelihood),
      priority: this.calculatePriorityFromLikelihoodSeverity(cause.likelihood, cause.severity),
      preventiveActions: (cause.preventionActions || []).map(action => ({
        id: action.id?.toString() || '',
        name: action.description || '',
        cost: action.cost || 0,
        priority: this.mapActionPriorityToString(action.priority),
        status: this.mapActionStatusToString(action.status),
        assignedTo: action.assignedTo || 'Unassigned',
        dueDate: action.dueDate ? new Date(action.dueDate).toLocaleDateString() : 'TBD'
      }))
    }));
  }

  /**
   * Map backend consequences to frontend format
   */
  private mapConsequencesToRiskConsequences(consequences: ConsequenceDto[]): any[] {
    return consequences.map(consequence => ({
      id: consequence.id?.toString() || '',
      name: consequence.description || '',
      severity: this.mapSeverityToString(consequence.severity),
      cost: consequence.potentialCost || 0,
      priority: this.calculatePriorityFromSeverity(consequence.severity),
      mitigationActions: (consequence.mitigationActions || []).map(action => ({
        id: action.id?.toString() || '',
        name: action.description || '',
        cost: action.estimatedCost || 0,
        priority: this.mapActionPriorityToString(action.priority),
        status: this.mapActionStatusToString(action.status),
        assignedTo: action.assignedTo || 'Unassigned',
        dueDate: action.dueDate ? new Date(action.dueDate).toLocaleDateString() : 'TBD'
      }))
    }));
  }

  /**
   * Helper mapping methods
   */
  private mapLikelihoodToString(likelihood?: Likelihood): string {
    if (likelihood === undefined || likelihood === null) return 'L3';
    return `L${likelihood}`;
  }

  private mapSeverityToString(severity?: Severity): string {
    if (severity === undefined || severity === null) return 'S3';
    return `S${severity}`;
  }

  private mapStatusToString(status?: number): string {
    // Assuming status enum: Identified=0, Assessed=1, Mitigated=2, etc.
    const statusMap: { [key: number]: string } = {
      0: 'Identified',
      1: 'Assessed',
      2: 'Mitigated',
      3: 'Accepted',
      4: 'Transferred',
      5: 'Avoided',
      6: 'Reviewed'
    };
    return statusMap[status || 0] || 'Open';
  }

  private mapActionStatusToString(status?: ActionStatus): string {
    const statusMap: { [key in ActionStatus]: string } = {
      [ActionStatus.NotStarted]: 'open',
      [ActionStatus.InProgress]: 'in-progress',
      [ActionStatus.Completed]: 'completed',
      [ActionStatus.Delayed]: 'delayed',
      [ActionStatus.OnHold]: 'on-hold',
      [ActionStatus.Cancelled]: 'cancelled'
    };
    return statusMap[status || ActionStatus.NotStarted];
  }

  private mapActionPriorityToString(priority?: ActionPriority): string {
    const priorityMap: { [key in ActionPriority]: string } = {
      [ActionPriority.Low]: 'low',
      [ActionPriority.Medium]: 'medium',
      [ActionPriority.High]: 'high',
      [ActionPriority.Urgent]: 'highest',
      [ActionPriority.Immediate]: 'highest'
    };
    return priorityMap[priority || ActionPriority.Medium];
  }

  private mapStringToActionPriority(priority: string): ActionPriority {
    const priorityMap: { [key: string]: ActionPriority } = {
      'low': ActionPriority.Low,
      'medium': ActionPriority.Medium,
      'high': ActionPriority.High,
      'highest': ActionPriority.Urgent
    };
    return priorityMap[priority] || ActionPriority.Medium;
  }

  private mapStringToActionStatus(status: string): ActionStatus {
    const statusMap: { [key: string]: ActionStatus } = {
      'open': ActionStatus.NotStarted,
      'in-progress': ActionStatus.InProgress,
      'completed': ActionStatus.Completed,
      'delayed': ActionStatus.Delayed,
      'on-hold': ActionStatus.OnHold,
      'cancelled': ActionStatus.Cancelled
    };
    return statusMap[status] || ActionStatus.NotStarted;
  }

  private mapStringToLikelihood(likelihood: string): Likelihood {
    const likelihoodValue = parseInt(likelihood, 10);
    return (likelihoodValue >= 1 && likelihoodValue <= 5) ? likelihoodValue as Likelihood : 3 as Likelihood;
  }

  private mapStringToSeverity(severity: string): Severity {
    const severityValue = parseInt(severity, 10);
    return (severityValue >= 1 && severityValue <= 5) ? severityValue as Severity : 3 as Severity;
  }

  private calculateRiskLevel(likelihood?: Likelihood, severity?: Severity): string {
    const l = likelihood || 3;
    const s = severity || 3;
    const score = l * s;
    
    if (score >= 20) return 'Critical';
    if (score >= 12) return 'High';
    if (score >= 6) return 'Medium';
    return 'Low';
  }

  private getRiskLevelColor(likelihood?: Likelihood, severity?: Severity): 'critical' | 'high' | 'medium' | 'low' {
    const level = this.calculateRiskLevel(likelihood, severity);
    return level.toLowerCase() as 'critical' | 'high' | 'medium' | 'low';
  }

  private getStatusColor(status?: number): 'open' | 'mitigated' | 'closed' {
    if (status === 2) return 'mitigated'; // Mitigated
    if (status === 1) return 'open'; // Assessed
    return 'open'; // Default
  }

  private calculatePriorityFromLikelihoodSeverity(likelihood?: Likelihood, severity?: Severity): string {
    const l = likelihood || 3;
    const s = severity || 3;
    const score = l * s;
    
    if (score >= 20) return 'highest';
    if (score >= 12) return 'high';
    if (score >= 6) return 'medium';
    return 'low';
  }

  private calculatePriorityFromSeverity(severity?: Severity): string {
    const s = severity || 3;
    
    if (s >= 5) return 'highest';
    if (s >= 4) return 'high';
    if (s >= 3) return 'medium';
    return 'low';
  }

  /**
   * Convert date from display format to ISO string for backend API
   */
  private convertDateToISOString(dateString: string): string {
    if (!dateString || dateString === 'TBD') {
      return new Date().toISOString().split('T')[0]; // Return today's date as fallback
    }
    
    try {
      // Handle different date formats
      if (dateString.includes('/')) {
        // Format like "9/15/2023" or "12/10/2023"
        const parts = dateString.split('/');
        if (parts.length === 3) {
          const month = parts[0].padStart(2, '0');
          const day = parts[1].padStart(2, '0');
          const year = parts[2];
          return `${year}-${month}-${day}`;
        }
      } else if (dateString.includes('-')) {
        // Already in ISO format like "2023-09-15"
        return dateString;
      }
      
      // Fallback: try to parse the date
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (error) {
      console.warn('Error converting date:', dateString, error);
    }
    
    // Ultimate fallback
    return new Date().toISOString().split('T')[0];
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/risk']);
  }

  editRisk(): void {
    this.router.navigate(['/risk', this.riskId, 'edit']);
  }

  /**
   * Refresh risk data from backend
   */
  refreshData(): void {
    this.loadRiskData();
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  deleteCause(causeId: string): void {
    if (this.risk) {
      this.risk.causes = this.risk.causes.filter(cause => cause.id !== causeId);
    }
  }

  deleteConsequence(consequenceId: string): void {
    if (this.risk) {
      this.risk.consequences = this.risk.consequences.filter(consequence => consequence.id !== consequenceId);
    }
  }

  deletePreventiveAction(causeId: string, actionId: string): void {
    if (this.risk) {
      const cause = this.risk.causes.find(c => c.id === causeId);
      if (cause) {
        cause.preventiveActions = cause.preventiveActions.filter(action => action.id !== actionId);
      }
    }
  }

  deleteMitigationAction(consequenceId: string, actionId: string): void {
    if (this.risk) {
      const consequence = this.risk.consequences.find(c => c.id === consequenceId);
      if (consequence) {
        consequence.mitigationActions = consequence.mitigationActions.filter(action => action.id !== actionId);
      }
    }
  }

  openLikelihoodModal(causeId: string): void {
    this.currentCauseId = causeId;
    const cause = this.risk?.causes.find(c => c.id === causeId);
    if (cause) {
      this.currentLikelihood = cause.likelihood;
    }
    this.showLikelihoodModal = true;
  }

  closeLikelihoodModal(): void {
    this.showLikelihoodModal = false;
    this.currentCauseId = '';
    this.currentLikelihood = '';
  }

  saveLikelihood(): void {
    if (this.risk && this.currentCauseId && this.currentLikelihood) {
      const cause = this.risk.causes?.find(c => c.id === this.currentCauseId);
      if (cause) {
        // Create DTO for backend API update
        const updateCauseDto: UpdateCauseForRiskDto = {
          description: cause.name,
          likelihood: this.mapStringToLikelihood(this.currentLikelihood),
          severity: 3 as Severity // Default severity - could be extracted from cause if available
        };

        console.log('Updating cause likelihood with DTO:', updateCauseDto); // Debug log
        console.log('Cause ID:', this.currentCauseId, 'New likelihood:', this.currentLikelihood); // Debug log

        // Call backend API to update cause
        this.riskCausesService.update(parseInt(this.currentCauseId, 10), updateCauseDto).subscribe({
          next: (result) => {
            console.log('Cause likelihood updated successfully:', result);
            
            // Update local data after successful save
            cause.likelihood = this.currentLikelihood;
            // Update priority based on new likelihood
            cause.priority = this.calculatePriorityFromLikelihoodSeverity(
              this.mapStringToLikelihood(this.currentLikelihood), 
              3 as Severity
            ) as 'medium' | 'high' | 'low' | 'highest';
            
            this.closeLikelihoodModal();
          },
          error: (error) => {
            console.error('Error updating cause likelihood:', error);
            // Show user-friendly error message
            alert('Failed to update likelihood. Please try again.');
            this.closeLikelihoodModal();
          }
        });
      } else {
        this.closeLikelihoodModal();
      }
    } else {
      this.closeLikelihoodModal();
    }
  }

  openPriorityModal(actionId: string): void {
    this.currentActionId = actionId;
    
    // Find the action to get current priority
    let action: any = null;
    
    // Search in preventive actions
    for (const cause of this.risk?.causes || []) {
      action = cause.preventiveActions.find(a => a.id === actionId);
      if (action) break;
    }
    
    // Search in mitigation actions if not found
    if (!action) {
      for (const consequence of this.risk?.consequences || []) {
        action = consequence.mitigationActions.find(a => a.id === actionId);
        if (action) break;
      }
    }
    
    if (action) {
      this.currentPriority = action.priority;
    }
    
    this.showPriorityModal = true;
  }

  closePriorityModal(): void {
    this.showPriorityModal = false;
    this.currentActionId = '';
    this.currentPriority = '';
  }

  savePriority(): void {
    if (!this.currentPriority) return;
    
    // Update in preventive actions
    for (const cause of this.risk?.causes || []) {
      const action = cause.preventiveActions.find(a => a.id === this.currentActionId);
      if (action) {
        // Create DTO for backend API update
        const updatePreventionActionDto: UpdatePreventionActionDto = {
          description: action.name,
          cost: action.cost,
          priority: this.mapStringToActionPriority(this.currentPriority),
          assignedTo: action.assignedTo,
          dueDate: this.convertDateToISOString(action.dueDate),
          status: this.mapStringToActionStatus(action.status)
        };

        console.log('Updating prevention action priority with DTO:', updatePreventionActionDto); // Debug log

        // Call backend API to update prevention action
        this.preventionActionService.update(parseInt(this.currentActionId, 10), updatePreventionActionDto).subscribe({
          next: (result) => {
            console.log('Prevention action priority updated successfully:', result);
            // Update local data after successful save
            action.priority = this.currentPriority as any;
            this.closePriorityModal();
          },
          error: (error) => {
            console.error('Error updating prevention action priority:', error);
            // Show user-friendly error message
            alert('Failed to update action priority. Please try again.');
            this.closePriorityModal();
          }
        });
        return;
      }
    }
    
    // Update in mitigation actions
    for (const consequence of this.risk?.consequences || []) {
      const action = consequence.mitigationActions.find(a => a.id === this.currentActionId);
      if (action) {
        // Create DTO for backend API update
        const updateMitigationActionDto: UpdateMitigationActionDto = {
          description: action.name,
          priority: this.mapStringToActionPriority(this.currentPriority),
          estimatedCost: action.cost,
          assignedTo: action.assignedTo,
          dueDate: this.convertDateToISOString(action.dueDate),
          status: this.mapStringToActionStatus(action.status)
        };

        console.log('Updating mitigation action priority with DTO:', updateMitigationActionDto); // Debug log

        // Call backend API to update mitigation action
        this.mitigationActionService.update(parseInt(this.currentActionId, 10), updateMitigationActionDto).subscribe({
          next: (result) => {
            console.log('Mitigation action priority updated successfully:', result);
            // Update local data after successful save
            action.priority = this.currentPriority as any;
            this.closePriorityModal();
          },
          error: (error) => {
            console.error('Error updating mitigation action priority:', error);
            // Show user-friendly error message
            alert('Failed to update action priority. Please try again.');
            this.closePriorityModal();
          }
        });
        return;
      }
    }
  }

  disableAction(actionId: string): void {
    // Update in preventive actions
    for (const cause of this.risk?.causes || []) {
      const action = cause.preventiveActions.find(a => a.id === actionId);
      if (action) {
        action.status = 'disabled';
        return;
      }
    }
    
    // Update in mitigation actions
    for (const consequence of this.risk?.consequences || []) {
      const action = consequence.mitigationActions.find(a => a.id === actionId);
      if (action) {
        action.status = 'disabled';
        return;
      }
    }
  }

  enableAction(actionId: string): void {
    // Update in preventive actions
    for (const cause of this.risk?.causes || []) {
      const action = cause.preventiveActions.find(a => a.id === actionId);
      if (action) {
        action.status = 'open';
        return;
      }
    }
    
    // Update in mitigation actions
    for (const consequence of this.risk?.consequences || []) {
      const action = consequence.mitigationActions.find(a => a.id === actionId);
      if (action) {
        action.status = 'open';
        return;
      }
    }
  }

  openSeverityModal(consequenceId: string): void {
    this.currentConsequenceId = consequenceId;
    const consequence = this.risk?.consequences.find(c => c.id === consequenceId);
    if (consequence) {
      this.currentSeverity = consequence.severity;
    }
    this.showSeverityModal = true;
  }

  closeSeverityModal(): void {
    this.showSeverityModal = false;
    this.currentConsequenceId = '';
    this.currentSeverity = '';
  }

  saveSeverity(): void {
    if (this.risk && this.currentConsequenceId && this.currentSeverity) {
      const consequence = this.risk.consequences?.find(c => c.id === this.currentConsequenceId);
      if (consequence) {
        // Create DTO for backend API update
        const updateConsequenceDto: UpdateConsequenceForRiskDto = {
          description: consequence.name,
          potentialCost: consequence.cost
        };

        console.log('Updating consequence severity with DTO:', updateConsequenceDto); // Debug log
        console.log('Consequence ID:', this.currentConsequenceId, 'New severity:', this.currentSeverity); // Debug log

        // Call backend API to update consequence
        this.riskConsequencesService.update(parseInt(this.currentConsequenceId, 10), updateConsequenceDto).subscribe({
          next: (result) => {
            console.log('Consequence severity updated successfully:', result);
            
            // Update local data after successful save
            consequence.severity = this.currentSeverity;
            // Update priority based on new severity
            consequence.priority = this.calculatePriorityFromSeverity(
              this.mapStringToSeverity(this.currentSeverity)
            ) as 'medium' | 'high' | 'low' | 'highest';
            
            this.closeSeverityModal();
          },
          error: (error) => {
            console.error('Error updating consequence severity:', error);
            // Show user-friendly error message
            alert('Failed to update severity. Please try again.');
            this.closeSeverityModal();
          }
        });
      } else {
        this.closeSeverityModal();
      }
    } else {
      this.closeSeverityModal();
    }
  }

  openCostModal(consequenceId: string): void {
    this.currentConsequenceId = consequenceId;
    const consequence = this.risk?.consequences.find(c => c.id === consequenceId);
    if (consequence) {
      this.currentCost = consequence.cost;
    }
    this.showCostModal = true;
  }

  closeCostModal(): void {
    this.showCostModal = false;
    this.currentConsequenceId = '';
    this.currentCost = 0;
  }

  saveCost(): void {
    if (this.risk && this.currentConsequenceId && this.currentCost >= 0) {
      const consequence = this.risk.consequences?.find(c => c.id === this.currentConsequenceId);
      if (consequence) {
        // Create DTO for backend API update
        const updateConsequenceDto: UpdateConsequenceForRiskDto = {
          description: consequence.name,
          potentialCost: this.currentCost
        };

        console.log('Updating consequence cost with DTO:', updateConsequenceDto); // Debug log
        console.log('Consequence ID:', this.currentConsequenceId, 'New cost:', this.currentCost); // Debug log

        // Call backend API to update consequence
        this.riskConsequencesService.update(parseInt(this.currentConsequenceId, 10), updateConsequenceDto).subscribe({
          next: (result) => {
            console.log('Consequence cost updated successfully:', result);
            
            // Update local data after successful save
            consequence.cost = this.currentCost;
            
            this.closeCostModal();
          },
          error: (error) => {
            console.error('Error updating consequence cost:', error);
            // Show user-friendly error message
            alert('Failed to update cost. Please try again.');
            this.closeCostModal();
          }
        });
      } else {
        this.closeCostModal();
      }
    } else {
      this.closeCostModal();
    }
  }

  // Action cost modal methods
  openActionCostModal(actionId: string): void {
    this.currentActionId = actionId;
    
    // Find the action in preventive actions
    for (const cause of this.risk?.causes || []) {
      const action = cause.preventiveActions.find(a => a.id === actionId);
      if (action) {
        this.currentActionCost = action.cost;
        this.showActionCostModal = true;
        return;
      }
    }
    
    // Find the action in mitigation actions
    for (const consequence of this.risk?.consequences || []) {
      const action = consequence.mitigationActions.find(a => a.id === actionId);
      if (action) {
        this.currentActionCost = action.cost;
        this.showActionCostModal = true;
        return;
      }
    }
  }

  closeActionCostModal(): void {
    this.showActionCostModal = false;
    this.currentActionId = '';
    this.currentActionCost = 0;
  }

  saveActionCost(): void {
    if (!this.currentActionId || this.currentActionCost < 0) {
      this.closeActionCostModal();
      return;
    }
    
    // Update in preventive actions
    for (const cause of this.risk?.causes || []) {
      const action = cause.preventiveActions.find(a => a.id === this.currentActionId);
      if (action) {
        // Create DTO for backend API update
        const updatePreventionActionDto: UpdatePreventionActionDto = {
          description: action.name,
          cost: this.currentActionCost,
          priority: this.mapStringToActionPriority(action.priority),
          assignedTo: action.assignedTo,
          dueDate: this.convertDateToISOString(action.dueDate),
          status: this.mapStringToActionStatus(action.status)
        };

        console.log('Updating prevention action cost with DTO:', updatePreventionActionDto); // Debug log

        // Call backend API to update prevention action
        this.preventionActionService.update(parseInt(this.currentActionId, 10), updatePreventionActionDto).subscribe({
          next: (result) => {
            console.log('Prevention action cost updated successfully:', result);
            // Update local data after successful save
            action.cost = this.currentActionCost;
            this.closeActionCostModal();
          },
          error: (error) => {
            console.error('Error updating prevention action cost:', error);
            // Show user-friendly error message
            alert('Failed to update action cost. Please try again.');
            this.closeActionCostModal();
          }
        });
        return;
      }
    }
    
    // Update in mitigation actions
    for (const consequence of this.risk?.consequences || []) {
      const action = consequence.mitigationActions.find(a => a.id === this.currentActionId);
      if (action) {
        // Create DTO for backend API update
        const updateMitigationActionDto: UpdateMitigationActionDto = {
          description: action.name,
          priority: this.mapStringToActionPriority(action.priority),
          estimatedCost: this.currentActionCost,
          assignedTo: action.assignedTo,
          dueDate: this.convertDateToISOString(action.dueDate),
          status: this.mapStringToActionStatus(action.status)
        };

        console.log('Updating mitigation action cost with DTO:', updateMitigationActionDto); // Debug log

        // Call backend API to update mitigation action
        this.mitigationActionService.update(parseInt(this.currentActionId, 10), updateMitigationActionDto).subscribe({
          next: (result) => {
            console.log('Mitigation action cost updated successfully:', result);
            // Update local data after successful save
            action.cost = this.currentActionCost;
            this.closeActionCostModal();
          },
          error: (error) => {
            console.error('Error updating mitigation action cost:', error);
            // Show user-friendly error message
            alert('Failed to update action cost. Please try again.');
            this.closeActionCostModal();
          }
        });
        return;
      }
    }
  }

  // Add new item modal methods
  openAddPreventiveActionModal(causeId: string): void {
    this.selectedCauseForAction = causeId;
    this.newPreventiveAction = {
      description: '',
      estimatedCost: 0,
      priority: 'medium'
    };
    this.showAddPreventiveActionModal = true;
  }

  closeAddPreventiveActionModal(): void {
    this.showAddPreventiveActionModal = false;
    this.selectedCauseForAction = '';
    // Reset the form
    this.newPreventiveAction = {
      description: '',
      estimatedCost: 0,
      priority: 'medium'
    };
  }

  savePreventiveAction(): void {
    if (this.risk && this.selectedCauseForAction && this.newPreventiveAction.description.trim()) {
      // Create DTO for backend API
      const preventionActionDto: CreatePreventionActionForCauseDto = {
        causeId: parseInt(this.selectedCauseForAction, 10),
        description: this.newPreventiveAction.description.trim(),
        priority: this.mapStringToActionPriority(this.newPreventiveAction.priority),
        cost: this.newPreventiveAction.estimatedCost || 0,
        assignedTo: 'Unassigned', // Mock default value as requested
        dueDate: new Date().toISOString().split('T')[0], // Mock default value as requested
        status: ActionStatus.NotStarted // Mock default value as requested
      };

      // Call backend API to save prevention action
      this.preventionActionService.create(preventionActionDto).subscribe({
        next: (result) => {
          console.log('Prevention action saved successfully:', result);
          
          // Update local data after successful save
          const cause = this.risk!.causes.find(c => c.id === this.selectedCauseForAction);
          if (cause) {
            const newAction = {
              id: result.id ? result.id.toString() : 'PA' + (Date.now()), // Convert to string
              name: preventionActionDto.description,
              cost: preventionActionDto.cost,
              priority: this.mapActionPriorityToString(preventionActionDto.priority) as 'medium' | 'high' | 'low' | 'highest',
              status: 'open' as const,
              assignedTo: preventionActionDto.assignedTo || 'Unassigned',
              dueDate: preventionActionDto.dueDate || 'TBD'
            };
            cause.preventiveActions.push(newAction);
          }
          
          this.closeAddPreventiveActionModal();
        },
        error: (error) => {
          console.error('Error saving prevention action:', error);
          // Show user-friendly error message
          alert('Failed to save prevention action. Please try again.');
        }
      });
    } else {
      this.closeAddPreventiveActionModal();
    }
  }

  openAddCauseModal(): void {
    this.newCause = {
      description: '',
      likelihood: '3'
    };
    this.showAddCauseModal = true;
  }

  closeAddCauseModal(): void {
    this.showAddCauseModal = false;
    // Reset the form
    this.newCause = {
      description: '',
      likelihood: '3'
    };
  }

  saveCause(): void {
    if (this.risk && this.newCause.description.trim()) {
      // Create DTO for backend API
      const causeDto: CreateCauseForRiskDto = {
        riskId: this.risk.id || parseInt(this.riskId, 10), // Use integer ID from loaded risk data
        description: this.newCause.description.trim(),
        likelihood: this.mapStringToLikelihood(this.newCause.likelihood),
        severity: 3 as Severity // Mock default value as requested
      };

      console.log('Saving cause with DTO:', causeDto); // Debug log
      console.log('Risk id:', this.risk.id, 'riskId string:', this.riskId); // Debug log

      // Call backend API to save cause
      this.riskCausesService.create(causeDto).subscribe({
        next: (result) => {
          console.log('Cause saved successfully:', result);
          
          // Update local data after successful save
          const newCause = {
            id: result.id ? result.id.toString() : 'C' + (Date.now()), // Convert to string
            name: causeDto.description,
            likelihood: this.mapLikelihoodToString(causeDto.likelihood),
            priority: this.calculatePriorityFromLikelihoodSeverity(causeDto.likelihood, causeDto.severity) as 'medium' | 'high' | 'low' | 'highest',
            preventiveActions: []
          };
          this.risk!.causes.push(newCause);
          
          this.closeAddCauseModal();
        },
        error: (error) => {
          console.error('Error saving cause:', error);
          // Show user-friendly error message
          alert('Failed to save cause. Please try again.');
        }
      });
    } else {
      this.closeAddCauseModal();
    }
  }

  openAddMitigationActionModal(consequenceId: string): void {
    this.selectedConsequenceForAction = consequenceId;
    this.newMitigationAction = {
      description: '',
      estimatedCost: 0,
      priority: 'medium'
    };
    this.showAddMitigationActionModal = true;
  }

  closeAddMitigationActionModal(): void {
    this.showAddMitigationActionModal = false;
    this.selectedConsequenceForAction = '';
    // Reset the form
    this.newMitigationAction = {
      description: '',
      estimatedCost: 0,
      priority: 'medium'
    };
  }

  saveMitigationAction(): void {
    if (this.risk && this.selectedConsequenceForAction && this.newMitigationAction.description.trim()) {
      // Create DTO for backend API
      const mitigationActionDto: CreateMitigationActionForConsequenceDto = {
        consequenceId: parseInt(this.selectedConsequenceForAction, 10),
        description: this.newMitigationAction.description.trim(),
        priority: this.mapStringToActionPriority(this.newMitigationAction.priority),
        estimatedCost: this.newMitigationAction.estimatedCost || 0,
        assignedTo: 'Unassigned', // Mock default value as requested
        dueDate: new Date().toISOString().split('T')[0], // Mock default value as requested
        status: ActionStatus.NotStarted // Mock default value as requested
      };

      // Call backend API to save mitigation action
      this.mitigationActionService.create(mitigationActionDto).subscribe({
        next: (result) => {
          console.log('Mitigation action saved successfully:', result);
          
          // Update local data after successful save
          const consequence = this.risk!.consequences.find(c => c.id === this.selectedConsequenceForAction);
          if (consequence) {
            const newAction = {
              id: result.id ? result.id.toString() : 'MA' + (Date.now()), // Convert to string
              name: mitigationActionDto.description,
              cost: mitigationActionDto.estimatedCost,
              priority: this.mapActionPriorityToString(mitigationActionDto.priority) as 'medium' | 'high' | 'low' | 'highest',
              status: 'open' as const,
              assignedTo: mitigationActionDto.assignedTo || 'Unassigned',
              dueDate: mitigationActionDto.dueDate || 'TBD'
            };
            consequence.mitigationActions.push(newAction);
          }
          
          this.closeAddMitigationActionModal();
        },
        error: (error) => {
          console.error('Error saving mitigation action:', error);
          // Show user-friendly error message
          alert('Failed to save mitigation action. Please try again.');
        }
      });
    } else {
      this.closeAddMitigationActionModal();
    }
  }

  openAddConsequenceModal(): void {
    this.newConsequence = {
      description: '',
      severity: '3',
      potentialCost: 0
    };
    this.showAddConsequenceModal = true;
  }

  closeAddConsequenceModal(): void {
    this.showAddConsequenceModal = false;
    // Reset the form
    this.newConsequence = {
      description: '',
      severity: '3',
      potentialCost: 0
    };
  }

  saveConsequence(): void {
    if (this.risk && this.newConsequence.description.trim()) {
      // Create DTO for backend API
      const consequenceDto: CreateConsequenceForRiskDto = {
        riskId: this.risk.id || parseInt(this.riskId, 10), // Use integer ID from loaded risk data
        description: this.newConsequence.description.trim(),
        potentialCost: this.newConsequence.potentialCost || 0
      };

      console.log('Saving consequence with DTO:', consequenceDto); // Debug log
      console.log('Risk id:', this.risk.id, 'riskId string:', this.riskId); // Debug log

      // Call backend API to save consequence
      this.riskConsequencesService.create(consequenceDto).subscribe({
        next: (result) => {
          console.log('Consequence saved successfully:', result);
          
          // Update local data after successful save
          const newConsequence = {
            id: result.id ? result.id.toString() : 'CON' + (Date.now()), // Convert to string
            name: consequenceDto.description,
            severity: this.mapSeverityToString(this.mapStringToSeverity(this.newConsequence.severity)),
            cost: consequenceDto.potentialCost,
            priority: this.calculatePriorityFromSeverity(this.mapStringToSeverity(this.newConsequence.severity)) as 'medium' | 'high' | 'low' | 'highest',
            mitigationActions: []
          };
          this.risk!.consequences.push(newConsequence);
          
          this.closeAddConsequenceModal();
        },
        error: (error) => {
          console.error('Error saving consequence:', error);
          // Show user-friendly error message
          alert('Failed to save consequence. Please try again.');
        }
      });
    } else {
      this.closeAddConsequenceModal();
    }
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.risk) {
      const newDiscussion: RiskDiscussion = {
        id: 'D' + (this.risk.discussions!.length + 1),
        author: 'Current User',
        authorInitials: 'CU',
        message: this.newMessage.trim(),
        timestamp: new Date().toISOString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      this.risk.discussions!.push(newDiscussion);
      this.newMessage = '';
    }
  }

  addToBowtie(message: string): void {
    console.log('Adding to Bowtie:', message);
    // Implement add to bowtie functionality
  }

  replyToMessage(discussionId: string): void {
    console.log('Reply to message:', discussionId);
    // Implement reply functionality
  }

  reassignAction(actionId: string): void {
    this.currentActionId = actionId;
    
    // Find the action to pre-populate the form
    let action: any = null;
    
    // Search in preventive actions
    for (const cause of this.risk?.causes || []) {
      action = cause.preventiveActions.find(a => a.id === actionId);
      if (action) break;
    }
    
    // Search in mitigation actions if not found
    if (!action) {
      for (const consequence of this.risk?.consequences || []) {
        action = consequence.mitigationActions.find(a => a.id === actionId);
        if (action) break;
      }
    }
    
    if (action) {
      this.reassignData = {
        description: action.name,
        assignedTo: action.assignedTo,
        businessUnit: '',
        priority: action.priority,
        estimatedCost: action.cost,
        startDate: '',
        dueDate: action.dueDate,
        comments: ''
      };
    }
    
    this.showReassignModal = true;
  }

  closeReassignModal(): void {
    this.showReassignModal = false;
    this.currentActionId = '';
    this.resetReassignData();
  }

  saveReassignment(): void {
    if (!this.reassignData.assignedTo || !this.reassignData.dueDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Update the action with new assignment data
    let updated = false;
    
    // Update in preventive actions
    if (!updated) {
      for (const cause of this.risk?.causes || []) {
        const actionIndex = cause.preventiveActions.findIndex(a => a.id === this.currentActionId);
        if (actionIndex !== -1) {
          cause.preventiveActions[actionIndex] = {
            ...cause.preventiveActions[actionIndex],
            name: this.reassignData.description,
            assignedTo: this.reassignData.assignedTo,
            priority: this.reassignData.priority as any,
            cost: this.reassignData.estimatedCost,
            dueDate: this.reassignData.dueDate
          };
          updated = true;
          break;
        }
      }
    }
    
    // Update in mitigation actions if not found in preventive
    if (!updated) {
      for (const consequence of this.risk?.consequences || []) {
        const actionIndex = consequence.mitigationActions.findIndex(a => a.id === this.currentActionId);
        if (actionIndex !== -1) {
          consequence.mitigationActions[actionIndex] = {
            ...consequence.mitigationActions[actionIndex],
            name: this.reassignData.description,
            assignedTo: this.reassignData.assignedTo,
            priority: this.reassignData.priority as any,
            cost: this.reassignData.estimatedCost,
            dueDate: this.reassignData.dueDate
          };
          updated = true;
          break;
        }
      }
    }
    
    this.closeReassignModal();
  }

  private resetReassignData(): void {
    this.reassignData = {
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

  updateActionStatus(actionId: string, event: any): void {
    const newStatus = event.target.value;
    
    // Update in preventive actions
    for (const cause of this.risk?.causes || []) {
      const action = cause.preventiveActions.find(a => a.id === actionId);
      if (action) {
        // Create DTO for backend API update
        const updatePreventionActionDto: UpdatePreventionActionDto = {
          description: action.name,
          cost: action.cost,
          priority: this.mapStringToActionPriority(action.priority),
          assignedTo: action.assignedTo,
          dueDate: this.convertDateToISOString(action.dueDate),
          status: this.mapStringToActionStatus(newStatus)
        };

        console.log('Updating prevention action status with DTO:', updatePreventionActionDto); // Debug log

        // Call backend API to update prevention action
        this.preventionActionService.update(parseInt(actionId, 10), updatePreventionActionDto).subscribe({
          next: (result) => {
            console.log('Prevention action status updated successfully:', result);
            // Update local data after successful save
            action.status = newStatus;
          },
          error: (error) => {
            console.error('Error updating prevention action status:', error);
            // Show user-friendly error message
            alert('Failed to update action status. Please try again.');
          }
        });
        return;
      }
    }
    
    // Update in mitigation actions
    for (const consequence of this.risk?.consequences || []) {
      const action = consequence.mitigationActions.find(a => a.id === actionId);
      if (action) {
        // Create DTO for backend API update
        const updateMitigationActionDto: UpdateMitigationActionDto = {
          description: action.name,
          priority: this.mapStringToActionPriority(action.priority),
          estimatedCost: action.cost,
          assignedTo: action.assignedTo,
          dueDate: this.convertDateToISOString(action.dueDate),
          status: this.mapStringToActionStatus(newStatus)
        };

        console.log('Updating mitigation action status with DTO:', updateMitigationActionDto); // Debug log

        // Call backend API to update mitigation action
        this.mitigationActionService.update(parseInt(actionId, 10), updateMitigationActionDto).subscribe({
          next: (result) => {
            console.log('Mitigation action status updated successfully:', result);
            // Update local data after successful save
            action.status = newStatus;
          },
          error: (error) => {
            console.error('Error updating mitigation action status:', error);
            // Show user-friendly error message
            alert('Failed to update action status. Please try again.');
          }
        });
        return;
      }
    }
  }

  // Sort methods
  sortCausesByPriority(): void {
    if (!this.risk) return;
    
    const priorityOrder = { 'highest': 4, 'high': 3, 'medium': 2, 'low': 1 };
    
    this.risk.causes.sort((a, b) => {
      const priorityA = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
      const priorityB = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
      
      return this.causesSortDirection === 'desc' ? priorityB - priorityA : priorityA - priorityB;
    });
    
    this.causesSortDirection = this.causesSortDirection === 'desc' ? 'asc' : 'desc';
  }

  sortConsequencesByPriority(): void {
    if (!this.risk) return;
    
    const priorityOrder = { 'highest': 4, 'high': 3, 'medium': 2, 'low': 1 };
    
    this.risk.consequences.sort((a, b) => {
      const priorityA = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
      const priorityB = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
      
      return this.consequencesSortDirection === 'desc' ? priorityB - priorityA : priorityA - priorityB;
    });
    
    this.consequencesSortDirection = this.consequencesSortDirection === 'desc' ? 'asc' : 'desc';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getRiskLevelClass(level: string): string {
    return `risk-level-${level}`;
  }

  // Bootstrap-specific helper methods
  getStatusBadgeClass(statusColor: string): string {
    switch (statusColor) {
      case 'open': return 'warning';
      case 'in-progress': return 'primary';
      case 'completed': return 'success';
      case 'closed': return 'secondary';
      default: return 'secondary';
    }
  }

  getRiskBadgeClass(riskColor: string): string {
    switch (riskColor) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'secondary';
    }
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'highest': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'secondary';
    }
  }

  getPriorityBorderClass(priority: string): string {
    switch (priority) {
      case 'highest': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'secondary';
    }
  }

  getActionCardClass(status: string): string {
    switch (status) {
      case 'completed': return 'bg-light border-success border-2';
      case 'in-progress': return 'bg-light border-primary border-2';
      case 'open': return 'bg-light border-warning border-2';
      case 'disabled': return 'bg-light border-secondary border-2 opacity-75';
      default: return 'bg-light border-2';
    }
  }
}
