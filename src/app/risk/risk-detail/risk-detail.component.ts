import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Risk, RiskDiscussion } from '../models/risk.interface';
import { RiskAnalysisComponent } from './risk-analysis/risk-analysis.component';
import { ActionTrackerComponent } from './action-tracker/action-tracker.component';
import { RiskService } from '../../proxy/risk-managment-system/risks/risk.service';
import { RiskDto, CauseDto, ConsequenceDto } from '../../proxy/risk-managment-system/risks/dtos/models';
import { ActionStatus, ActionPriority, Likelihood, Severity } from '../../proxy/risk-managment-system/domain/shared/enums';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-risk-detail',
  templateUrl: './risk-detail.component.html',
  styleUrls: ['./risk-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RiskAnalysisComponent, ActionTrackerComponent]
})
export class RiskDetailComponent implements OnInit {
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
    id: 'RISK-001',
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
    private riskService: RiskService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.riskId = params['id'];
      this.loadRiskData();
    });
  }

  loadRiskData(): void {
    if (!this.riskId) {
      this.loadError = 'No risk ID provided';
      return;
    }

    this.isLoading = true;
    this.loadError = null;

    this.riskService.getByRiskId(this.riskId)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (riskDto: RiskDto) => {
          this.risk = this.mapRiskDtoToRisk(riskDto);
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
      this.risk = { ...this.mockRisk, id: this.riskId };
    }
    this.sortCausesByPriority();
    this.sortConsequencesByPriority();
  }

  /**
   * Map backend RiskDto to frontend Risk interface
   */
  private mapRiskDtoToRisk(riskDto: RiskDto): Risk {
    return {
      id: riskDto.riskId || '',
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
      const cause = this.risk.causes.find(c => c.id === this.currentCauseId);
      if (cause) {
        cause.likelihood = this.currentLikelihood;
      }
    }
    this.closeLikelihoodModal();
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
        action.priority = this.currentPriority as any;
        this.closePriorityModal();
        return;
      }
    }
    
    // Update in mitigation actions
    for (const consequence of this.risk?.consequences || []) {
      const action = consequence.mitigationActions.find(a => a.id === this.currentActionId);
      if (action) {
        action.priority = this.currentPriority as any;
        this.closePriorityModal();
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
      const consequence = this.risk.consequences.find(c => c.id === this.currentConsequenceId);
      if (consequence) {
        consequence.severity = this.currentSeverity;
      }
    }
    this.closeSeverityModal();
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
      const consequence = this.risk.consequences.find(c => c.id === this.currentConsequenceId);
      if (consequence) {
        consequence.cost = this.currentCost;
      }
    }
    this.closeCostModal();
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
  }

  savePreventiveAction(): void {
    if (this.risk && this.selectedCauseForAction && this.newPreventiveAction.description.trim()) {
      const cause = this.risk.causes.find(c => c.id === this.selectedCauseForAction);
      if (cause) {
        const newAction = {
          id: 'PA' + (Date.now()), // Simple ID generation
          name: this.newPreventiveAction.description.trim(),
          cost: this.newPreventiveAction.estimatedCost,
          priority: this.newPreventiveAction.priority as 'medium' | 'high' | 'low' | 'highest',
          status: 'open' as const,
          assignedTo: 'Unassigned',
          dueDate: 'TBD'
        };
        cause.preventiveActions.push(newAction);
      }
    }
    this.closeAddPreventiveActionModal();
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
  }

  saveCause(): void {
    if (this.risk && this.newCause.description.trim()) {
      const newCause = {
        id: 'C' + (Date.now()), // Simple ID generation
        name: this.newCause.description.trim(),
        likelihood: 'L' + this.newCause.likelihood,
        priority: 'medium' as const,
        preventiveActions: []
      };
      this.risk.causes.push(newCause);
    }
    this.closeAddCauseModal();
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
  }

  saveMitigationAction(): void {
    if (this.risk && this.selectedConsequenceForAction && this.newMitigationAction.description.trim()) {
      const consequence = this.risk.consequences.find(c => c.id === this.selectedConsequenceForAction);
      if (consequence) {
        const newAction = {
          id: 'MA' + (Date.now()), // Simple ID generation
          name: this.newMitigationAction.description.trim(),
          cost: this.newMitigationAction.estimatedCost,
          priority: this.newMitigationAction.priority as 'medium' | 'high' | 'low' | 'highest',
          status: 'open' as const,
          assignedTo: 'Unassigned',
          dueDate: 'TBD'
        };
        consequence.mitigationActions.push(newAction);
      }
    }
    this.closeAddMitigationActionModal();
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
  }

  saveConsequence(): void {
    if (this.risk && this.newConsequence.description.trim()) {
      const newConsequence = {
        id: 'CON' + (Date.now()), // Simple ID generation
        name: this.newConsequence.description.trim(),
        severity: 'S' + this.newConsequence.severity,
        cost: this.newConsequence.potentialCost,
        priority: 'medium' as const,
        mitigationActions: []
      };
      this.risk.consequences.push(newConsequence);
    }
    this.closeAddConsequenceModal();
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
        action.status = newStatus;
        return;
      }
    }
    
    // Update in mitigation actions
    for (const consequence of this.risk?.consequences || []) {
      const action = consequence.mitigationActions.find(a => a.id === actionId);
      if (action) {
        action.status = newStatus;
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
