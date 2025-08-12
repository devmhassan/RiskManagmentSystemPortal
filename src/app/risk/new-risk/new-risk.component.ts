import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BasicInformationComponent } from './basic-information/basic-information.component';
import { RiskAssessmentComponent } from './risk-assessment/risk-assessment.component';
import { BowtieComponentsComponent } from './bowtie-components/bowtie-components.component';
import { RiskFormService } from '../services/risk-form.service';
import { RiskService } from '../../proxy/risk-managment-system/risks/risk.service';
import { ToasterService } from '@abp/ng.theme.shared';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-new-risk',
  templateUrl: './new-risk.component.html',
  styleUrls: ['./new-risk.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    BasicInformationComponent,
    RiskAssessmentComponent,
    BowtieComponentsComponent
  ]
})
export class NewRiskComponent implements OnInit {
  currentStep = 2;
  totalSteps = 3;
  isLoading = false;

  steps = [
    { id: 1, label: 'Basic Information', active: true, completed: false },
    { id: 2, label: 'Risk Assessment', active: false, completed: false },
    { id: 3, label: 'Bowtie Components', active: false, completed: false }
  ];

  constructor(
    private router: Router,
    private riskFormService: RiskFormService,
    private riskService: RiskService,
    private toaster: ToasterService
  ) {}

  ngOnInit() {
    // Initialize first step
    this.updateStepStatus();
    // Only reset form if it's a completely new risk creation
    const existingData = this.riskFormService.getCurrentFormData();
    if (!existingData.riskId && !existingData.description) {
      this.riskFormService.resetForm();
    }
  }

  goToStep(stepId: number) {
    if (stepId <= this.currentStep || this.steps[stepId - 2]?.completed) {
      this.currentStep = stepId;
      this.updateStepStatus();
    }
  }

  updateStepStatus() {
    this.steps.forEach(step => {
      step.active = step.id === this.currentStep;
      if (step.id < this.currentStep) {
        step.completed = true;
      }
    });
  }

  nextStep() {
    // Validate current step before proceeding
    if (!this.isCurrentStepValid()) {
      this.toaster.error('Please complete all required fields before proceeding.', 'Validation Error');
      return;
    }

    if (this.currentStep < this.totalSteps) {
      // Mark the current step as completed
      this.steps[this.currentStep - 1].completed = true;
      // Move to the next step
      this.goToStep(this.currentStep + 1);
    }
  }

  isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.riskFormService.isBasicInformationValid();
      case 2:
        return this.riskFormService.isRiskAssessmentValid();
      case 3:
        return this.riskFormService.isBowtieComponentsValid();
      default:
        return false;
    }
  }

  canProceedToNext(): boolean {
    return this.isCurrentStepValid();
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.goToStep(this.currentStep - 1);
    }
  }

  onCancel() {
    this.riskFormService.resetForm();
    this.router.navigate(['/risk']);
  }

  onSave() {
    try {
      this.isLoading = true;
      const createRiskDto = this.riskFormService.convertToCreateRiskDto();
      
      this.riskService.create(createRiskDto)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (response) => {
            this.toaster.success('Risk created successfully!', 'Success');
            this.riskFormService.resetForm();
            this.router.navigate(['/risk']);
          },
          error: (error) => {
            console.error('Error creating risk:', error);
            this.toaster.error(
              error.error?.message || 'Failed to create risk. Please try again.',
              'Error'
            );
          }
        });
    } catch (error: any) {
      this.isLoading = false;
      this.toaster.error(error.message || 'Please complete all required fields.', 'Validation Error');
    }
  }

  canSave(): boolean {
    try {
      this.riskFormService.convertToCreateRiskDto();
      return true;
    } catch {
      return false;
    }
  }
}
