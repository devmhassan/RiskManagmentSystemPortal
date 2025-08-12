import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RiskFormService } from '../../services/risk-form.service';
import { Likelihood, likelihoodOptions } from '../../../proxy/risk-managment-system/domain/shared/enums/likelihood.enum';
import { Severity, severityOptions } from '../../../proxy/risk-managment-system/domain/shared/enums/severity.enum';

@Component({
  selector: 'app-risk-assessment',
  templateUrl: './risk-assessment.component.html',
  styleUrls: ['./risk-assessment.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class RiskAssessmentComponent implements OnInit {
  assessmentForm: FormGroup;
  private isUpdatingFromService = false; // Guard to prevent circular updates

  // Using proxy enums
  likelihoodOptions = likelihoodOptions;
  severityOptions = severityOptions;
  Likelihood = Likelihood;
  Severity = Severity;

  constructor(
    private fb: FormBuilder,
    private riskFormService: RiskFormService
  ) {
    this.assessmentForm = this.fb.group({
      initialLikelihood: [Likelihood.Possible, Validators.required],
      initialSeverity: [Severity.Moderate, Validators.required],
      residualLikelihood: [Likelihood.Possible, Validators.required],
      residualSeverity: [Severity.Moderate, Validators.required]
    });

    // Subscribe to changes for risk level calculations with guard
    this.assessmentForm.valueChanges.subscribe(() => {
      if (!this.isUpdatingFromService) {
        this.updateFormData();
      }
    });
  }

  ngOnInit() {
    // Load existing form data if available
    this.riskFormService.riskFormData$.subscribe(data => {
      if (data.initialLikelihood) {
        this.isUpdatingFromService = true; // Set guard before patching
        this.assessmentForm.patchValue({
          initialLikelihood: data.initialLikelihood,
          initialSeverity: data.initialSeverity,
          residualLikelihood: data.residualLikelihood,
          residualSeverity: data.residualSeverity
        });
        this.isUpdatingFromService = false; // Clear guard after patching
      }
    });
  }

  private updateFormData() {
    const formValue = this.assessmentForm.value;
    const residualRiskLevel = this.calculateRiskLevel(formValue.residualLikelihood, formValue.residualSeverity);
    
    this.riskFormService.updateRiskAssessment({
      initialLikelihood: formValue.initialLikelihood,
      initialSeverity: formValue.initialSeverity,
      residualLikelihood: formValue.residualLikelihood || 0, // Ensure 0 as default
      residualSeverity: formValue.residualSeverity || 0, // Ensure 0 as default
      residualRiskLevel: residualRiskLevel
    });
  }

  calculateInitialRiskLevel(): number {
    const likelihood = this.assessmentForm.get('initialLikelihood')?.value;
    const severity = this.assessmentForm.get('initialSeverity')?.value;
    return this.calculateRiskLevel(likelihood, severity);
  }

  calculateResidualRiskLevel(): number {
    const likelihood = this.assessmentForm.get('residualLikelihood')?.value;
    const severity = this.assessmentForm.get('residualSeverity')?.value;
    return this.calculateRiskLevel(likelihood, severity);
  }

  private calculateRiskLevel(likelihood: number, severity: number): number {
    if (!likelihood || !severity) return 0;
    return likelihood * severity;
  }

  getRiskLevelText(level: number): string {
    if (level >= 20) return 'Critical';
    if (level >= 15) return 'High';
    if (level >= 8) return 'Medium';
    if (level >= 3) return 'Low';
    return 'Very Low';
  }

  getRiskLevelClass(level: number): string {
    if (level >= 20) return 'risk-critical';
    if (level >= 15) return 'risk-high';
    if (level >= 8) return 'risk-medium';
    if (level >= 3) return 'risk-low';
    return 'risk-very-low';
  }

  isFormValid(): boolean {
    return this.assessmentForm.valid;
  }
}
