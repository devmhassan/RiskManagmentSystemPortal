import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RiskFormService } from '../../services/risk-form.service';
import { CreateCauseDto, CreateConsequenceDto, CreatePreventionActionDto, CreateMitigationActionDto } from '../../../proxy/risk-managment-system/risks/dtos/models';
import { Likelihood, likelihoodOptions } from '../../../proxy/risk-managment-system/domain/shared/enums/likelihood.enum';
import { Severity, severityOptions } from '../../../proxy/risk-managment-system/domain/shared/enums/severity.enum';
import { ActionPriority, actionPriorityOptions } from '../../../proxy/risk-managment-system/domain/shared/enums/action-priority.enum';

@Component({
  selector: 'app-bowtie-components',
  templateUrl: './bowtie-components.component.html',
  styleUrls: ['./bowtie-components.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class BowtieComponentsComponent implements OnInit {
  bowtieForm: FormGroup;
  private isUpdatingFromService = false; // Guard to prevent circular updates
  
  // Enum options for dropdowns
  likelihoodOptions = likelihoodOptions;
  severityOptions = severityOptions;
  actionPriorityOptions = actionPriorityOptions;
  
  // Enum references
  Likelihood = Likelihood;
  Severity = Severity;
  ActionPriority = ActionPriority;

  constructor(
    private fb: FormBuilder,
    private riskFormService: RiskFormService
  ) {
    this.bowtieForm = this.fb.group({
      causes: this.fb.array([]),
      consequences: this.fb.array([])
    });
  }

  ngOnInit() {
    // Load existing form data if available
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

    // Subscribe to form changes with guard to prevent circular updates
    this.bowtieForm.valueChanges.subscribe(() => {
      if (!this.isUpdatingFromService) {
        this.updateFormData();
      }
    });
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
    this.causes.removeAt(index);
    this.updateFormData();
  }

  // Prevention Actions helpers
  getPreventionActions(causeIndex: number): FormArray {
    return this.causes.at(causeIndex).get('preventionActions') as FormArray;
  }

  createPreventionActionFormGroup(): FormGroup {
    return this.fb.group({
      description: ['', [Validators.required, Validators.minLength(5)]],
      cost: [0, [Validators.required, Validators.min(0)]],
      priority: [ActionPriority.Medium, Validators.required]
    });
  }

  addPreventionAction(causeIndex: number) {
    const preventionActionsArray = this.getPreventionActions(causeIndex);
    preventionActionsArray.push(this.createPreventionActionFormGroup());
  }

  removePreventionAction(causeIndex: number, actionIndex: number) {
    const preventionActionsArray = this.getPreventionActions(causeIndex);
    preventionActionsArray.removeAt(actionIndex);
    this.updateFormData();
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
    this.consequences.removeAt(index);
    this.updateFormData();
  }

  // Mitigation Actions helpers
  getMitigationActions(consequenceIndex: number): FormArray {
    return this.consequences.at(consequenceIndex).get('mitigationActions') as FormArray;
  }

  createMitigationActionFormGroup(): FormGroup {
    return this.fb.group({
      description: ['', [Validators.required, Validators.minLength(5)]],
      priority: [ActionPriority.Medium, Validators.required],
      dueDate: ['']
    });
  }

  addMitigationAction(consequenceIndex: number) {
    const mitigationActionsArray = this.getMitigationActions(consequenceIndex);
    mitigationActionsArray.push(this.createMitigationActionFormGroup());
  }

  removeMitigationAction(consequenceIndex: number, actionIndex: number) {
    const mitigationActionsArray = this.getMitigationActions(consequenceIndex);
    mitigationActionsArray.removeAt(actionIndex);
    this.updateFormData();
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
    if (this.bowtieForm.valid) {
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

      this.riskFormService.updateBowtieComponents({
        causes,
        consequences
      });
    }
  }

  isFormValid(): boolean {
    return this.bowtieForm.valid && this.causes.length > 0 && this.consequences.length > 0;
  }
}
