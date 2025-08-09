import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RiskFormService } from '../../services/risk-form.service';
import { RiskService } from '../../../proxy/risk-managment-system/risks/risk.service';
import { CreateCauseDto, CreateConsequenceDto, CreatePreventionActionDto, CreateMitigationActionDto, RiskDto, CauseDto, ConsequenceDto } from '../../../proxy/risk-managment-system/risks/dtos/models';
import { Likelihood, likelihoodOptions } from '../../../proxy/risk-managment-system/domain/shared/enums/likelihood.enum';
import { Severity, severityOptions } from '../../../proxy/risk-managment-system/domain/shared/enums/severity.enum';
import { ActionPriority, actionPriorityOptions } from '../../../proxy/risk-managment-system/domain/shared/enums/action-priority.enum';
import { ActionStatus, actionStatusOptions } from '../../../proxy/risk-managment-system/domain/shared/enums/action-status.enum';

@Component({
  selector: 'app-bowtie-components',
  templateUrl: './bowtie-components.component.html',
  styleUrls: ['./bowtie-components.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class BowtieComponentsComponent implements OnInit {
  @Input() riskId?: string; // Input to receive riskId for fetching existing data
  bowtieForm: FormGroup;
  private isUpdatingFromService = false; // Guard to prevent circular updates
  isLoading = false;
  isEditMode = false;
  
  // Enum options for dropdowns
  likelihoodOptions = likelihoodOptions;
  severityOptions = severityOptions;
  actionPriorityOptions = actionPriorityOptions;
  actionStatusOptions = actionStatusOptions;
  
  // Enum references
  Likelihood = Likelihood;
  Severity = Severity;
  ActionPriority = ActionPriority;
  ActionStatus = ActionStatus;

  constructor(
    private fb: FormBuilder,
    private riskFormService: RiskFormService,
    private riskService: RiskService
  ) {
    this.bowtieForm = this.fb.group({
      causes: this.fb.array([]),
      consequences: this.fb.array([])
    });
  }

  ngOnInit() {
    // Check if we have a riskId to fetch existing data
    if (this.riskId) {
      this.isEditMode = true;
      this.loadRiskData(this.riskId);
    } else {
      // Load existing form data if available from service (create mode)
      this.riskFormService.riskFormData$.subscribe(data => {
        if (data.causes && data.causes.length > 0) {
          this.isUpdatingFromService = true; // Set guard before loading data
          this.loadExistingData(data.causes, data.consequences || []);
          this.isUpdatingFromService = false; // Clear guard after loading
        } else if (!this.isUpdatingFromService) {
          // Only add initial data if not updating from service
          this.addCause();
          this.addConsequence();
        }
      });
    }

    // Subscribe to form changes with guard to prevent circular updates
    this.bowtieForm.valueChanges.subscribe(() => {
      if (!this.isUpdatingFromService && !this.isEditMode) {
        this.updateFormData();
      }
    });
  }

  /**
   * Load risk data from backend API
   */
  private loadRiskData(riskId: string) {
    this.isLoading = true;
    this.riskService.getByRiskId(riskId).subscribe({
      next: (riskData: RiskDto) => {
        this.loadRiskDataToForm(riskData);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading risk data:', error);
        this.isLoading = false;
        // Fallback to empty form
        this.addCause();
        this.addConsequence();
      }
    });
  }

  /**
   * Map backend RiskDto to form structure
   */
  private loadRiskDataToForm(riskData: RiskDto) {
    this.isUpdatingFromService = true;
    
    // Clear existing form arrays
    while (this.causes.length) {
      this.causes.removeAt(0);
    }
    while (this.consequences.length) {
      this.consequences.removeAt(0);
    }

    // Map causes from backend to form
    if (riskData.causes && riskData.causes.length > 0) {
      riskData.causes.forEach(cause => {
        const causeGroup = this.createCauseFormGroup();
        
        causeGroup.patchValue({
          description: cause.description || '',
          likelihood: cause.likelihood || Likelihood.Possible,
          severity: cause.severity || Severity.Moderate
        });

        // Map prevention actions
        const preventionActions = causeGroup.get('preventionActions') as FormArray;
        if (cause.preventionActions && cause.preventionActions.length > 0) {
          cause.preventionActions.forEach(action => {
            const actionGroup = this.createPreventionActionFormGroup();
            actionGroup.patchValue({
              description: action.description || '',
              cost: action.cost || 0,
              priority: action.priority || ActionPriority.Medium,
              status: action.status || ActionStatus.NotStarted,
              assignedTo: action.assignedTo || '',
              dueDate: action.dueDate ? new Date(action.dueDate).toISOString().split('T')[0] : ''
            });
            preventionActions.push(actionGroup);
          });
        } else {
          // Add at least one empty prevention action
          preventionActions.push(this.createPreventionActionFormGroup());
        }

        this.causes.push(causeGroup);
      });
    }

    // Map consequences from backend to form
    if (riskData.consequences && riskData.consequences.length > 0) {
      riskData.consequences.forEach(consequence => {
        const consequenceGroup = this.createConsequenceFormGroup();
        
        consequenceGroup.patchValue({
          description: consequence.description || '',
          severity: consequence.severity || Severity.Moderate,
          potentialCost: consequence.potentialCost || 0
        });

        // Map mitigation actions
        const mitigationActions = consequenceGroup.get('mitigationActions') as FormArray;
        if (consequence.mitigationActions && consequence.mitigationActions.length > 0) {
          consequence.mitigationActions.forEach(action => {
            const actionGroup = this.createMitigationActionFormGroup();
            actionGroup.patchValue({
              description: action.description || '',
              priority: action.priority || ActionPriority.Medium,
              status: action.status || ActionStatus.NotStarted,
              estimatedCost: action.estimatedCost || 0,
              assignedTo: action.assignedTo || '',
              dueDate: action.dueDate ? new Date(action.dueDate).toISOString().split('T')[0] : ''
            });
            mitigationActions.push(actionGroup);
          });
        } else {
          // Add at least one empty mitigation action
          mitigationActions.push(this.createMitigationActionFormGroup());
        }

        this.consequences.push(consequenceGroup);
      });
    }

    // If no causes or consequences, add empty ones
    if (this.causes.length === 0) {
      this.addCause();
    }
    if (this.consequences.length === 0) {
      this.addConsequence();
    }

    this.isUpdatingFromService = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Causes FormArray helpers
  get causes(): FormArray {
    return this.bowtieForm.get('causes') as FormArray;
  }

  createCauseFormGroup(): FormGroup {
    return this.fb.group({
      description: ['', [Validators.required, Validators.minLength(5)]],
      likelihood: [Likelihood.Possible, Validators.required],
      severity: [Severity.Moderate, Validators.required],
      preventionActions: this.fb.array([])
    });
  }

  addCause() {
    const causeGroup = this.createCauseFormGroup();
    this.causes.push(causeGroup);
    // Add initial prevention action for the new cause
    this.addPreventionAction(this.causes.length - 1);
  }

  removeCause(index: number) {
    if (this.causes.length > 1) {
      this.causes.removeAt(index);
      this.updateFormData();
    }
  }

  // Prevention Actions helpers
  getPreventionActions(causeIndex: number): FormArray {
    return this.causes.at(causeIndex).get('preventionActions') as FormArray;
  }

  createPreventionActionFormGroup(): FormGroup {
    return this.fb.group({
      description: [''], // Make description optional
      cost: [0, [Validators.required, Validators.min(0)]],
      priority: [ActionPriority.Medium, Validators.required],
      status: [ActionStatus.NotStarted, Validators.required],
      assignedTo: [''],
      dueDate: ['']
    });
  }

  addPreventionAction(causeIndex: number) {
    const preventionActionsArray = this.getPreventionActions(causeIndex);
    preventionActionsArray.push(this.createPreventionActionFormGroup());
  }

  removePreventionAction(causeIndex: number, actionIndex: number) {
    const preventionActionsArray = this.getPreventionActions(causeIndex);
    if (preventionActionsArray.length > 1) {
      preventionActionsArray.removeAt(actionIndex);
      this.updateFormData();
    }
  }

  // Consequences FormArray helpers
  get consequences(): FormArray {
    return this.bowtieForm.get('consequences') as FormArray;
  }

  createConsequenceFormGroup(): FormGroup {
    return this.fb.group({
      description: ['', [Validators.required, Validators.minLength(5)]],
      severity: [Severity.Moderate, Validators.required],
      potentialCost: [0, [Validators.required, Validators.min(0)]],
      mitigationActions: this.fb.array([])
    });
  }

  addConsequence() {
    const consequenceGroup = this.createConsequenceFormGroup();
    this.consequences.push(consequenceGroup);
    // Add initial mitigation action for the new consequence
    this.addMitigationAction(this.consequences.length - 1);
  }

  removeConsequence(index: number) {
    if (this.consequences.length > 1) {
      this.consequences.removeAt(index);
      this.updateFormData();
    }
  }

  // Mitigation Actions helpers
  getMitigationActions(consequenceIndex: number): FormArray {
    return this.consequences.at(consequenceIndex).get('mitigationActions') as FormArray;
  }

  createMitigationActionFormGroup(): FormGroup {
    return this.fb.group({
      description: [''], // Make description optional
      priority: [ActionPriority.Medium, Validators.required],
      status: [ActionStatus.NotStarted, Validators.required],
      estimatedCost: [0, [Validators.min(0)]],
      assignedTo: [''],
      dueDate: ['']
    });
  }

  addMitigationAction(consequenceIndex: number) {
    const mitigationActionsArray = this.getMitigationActions(consequenceIndex);
    mitigationActionsArray.push(this.createMitigationActionFormGroup());
  }

  removeMitigationAction(consequenceIndex: number, actionIndex: number) {
    const mitigationActionsArray = this.getMitigationActions(consequenceIndex);
    if (mitigationActionsArray.length > 1) {
      mitigationActionsArray.removeAt(actionIndex);
      this.updateFormData();
    }
  }

  private loadExistingData(causes: CreateCauseDto[], consequences: CreateConsequenceDto[]) {
    // Clear existing form arrays
    while (this.causes.length) {
      this.causes.removeAt(0);
    }
    while (this.consequences.length) {
      this.consequences.removeAt(0);
    }

    // Load causes
    causes.forEach(cause => {
      const causeGroup = this.createCauseFormGroup();
      causeGroup.patchValue({
        description: cause.description,
        likelihood: cause.likelihood,
        severity: cause.severity
      });

      // Load prevention actions
      const preventionActions = causeGroup.get('preventionActions') as FormArray;
      cause.preventionActions.forEach(action => {
        const actionGroup = this.createPreventionActionFormGroup();
        actionGroup.patchValue(action);
        preventionActions.push(actionGroup);
      });

      this.causes.push(causeGroup);
    });

    // Load consequences
    consequences.forEach(consequence => {
      const consequenceGroup = this.createConsequenceFormGroup();
      consequenceGroup.patchValue({
        description: consequence.description,
        severity: consequence.severity,
        potentialCost: consequence.potentialCost
      });

      // Load mitigation actions
      const mitigationActions = consequenceGroup.get('mitigationActions') as FormArray;
      consequence.mitigationActions.forEach(action => {
        const actionGroup = this.createMitigationActionFormGroup();
        actionGroup.patchValue(action);
        mitigationActions.push(actionGroup);
      });

      this.consequences.push(consequenceGroup);
    });
  }

  private updateFormData() {
    const formValue = this.bowtieForm.value;
    
    const causes: CreateCauseDto[] = formValue.causes.map((cause: any) => ({
      description: cause.description,
      likelihood: cause.likelihood,
      severity: cause.severity,
      preventionActions: cause.preventionActions
        .filter((action: any) => action.description && action.description.trim().length > 0)
        .map((action: any) => ({
          description: action.description,
          cost: action.cost,
          priority: action.priority
        }))
    }));

    const consequences: CreateConsequenceDto[] = formValue.consequences.map((consequence: any) => ({
      description: consequence.description,
      severity: consequence.severity,
      potentialCost: consequence.potentialCost,
      mitigationActions: consequence.mitigationActions
        .filter((action: any) => action.description && action.description.trim().length > 0)
        .map((action: any) => ({
          description: action.description,
          priority: action.priority,
          dueDate: action.dueDate
        }))
    }));

    this.riskFormService.updateBowtieComponents({
      causes,
      consequences
    });
  }

  isFormValid(): boolean {
    return this.bowtieForm.valid && 
           this.causes.length > 0 && 
           this.consequences.length > 0 &&
           !this.isLoading;
  }

  /**
   * Check if component is in loading state
   */
  isComponentLoading(): boolean {
    return this.isLoading;
  }

  /**
   * Check if component is in edit mode
   */
  isInEditMode(): boolean {
    return this.isEditMode;
  }

  /**
   * Get current form data in CreateRiskDto format for the parent component
   */
  getBowtieFormData(): { causes: CreateCauseDto[], consequences: CreateConsequenceDto[] } {
    if (!this.bowtieForm.valid) {
      return { causes: [], consequences: [] };
    }

    const formValue = this.bowtieForm.value;
    
    const causes: CreateCauseDto[] = formValue.causes.map((cause: any) => ({
      description: cause.description,
      likelihood: cause.likelihood,
      severity: cause.severity,
      preventionActions: cause.preventionActions.map((action: any) => ({
        description: action.description,
        cost: action.cost,
        priority: action.priority
      }))
    }));

    const consequences: CreateConsequenceDto[] = formValue.consequences.map((consequence: any) => ({
      description: consequence.description,
      severity: consequence.severity,
      potentialCost: consequence.potentialCost,
      mitigationActions: consequence.mitigationActions.map((action: any) => ({
        description: action.description,
        priority: action.priority,
        dueDate: action.dueDate
      }))
    }));

    return { causes, consequences };
  }

  /**
   * Refresh data from backend (useful for edit mode)
   */
  refreshData() {
    if (this.riskId && this.isEditMode) {
      this.loadRiskData(this.riskId);
    }
  }

  // TrackBy functions to prevent unnecessary re-rendering
  trackByCause(index: number, item: any): number {
    return index;
  }

  trackByConsequence(index: number, item: any): number {
    return index;
  }

  trackByPreventionAction(index: number, item: any): number {
    return index;
  }

  trackByMitigationAction(index: number, item: any): number {
    return index;
  }
}
