import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-risk-assessment',
  templateUrl: './risk-assessment.component.html',
  styleUrls: ['./risk-assessment.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class RiskAssessmentComponent {
  assessmentForm: FormGroup;

  impactLevels = [
    { value: 1, label: 'Very Low' },
    { value: 2, label: 'Low' },
    { value: 3, label: 'Medium' },
    { value: 4, label: 'High' },
    { value: 5, label: 'Very High' }
  ];

  likelihoodLevels = [
    { value: 1, label: 'Rare' },
    { value: 2, label: 'Unlikely' },
    { value: 3, label: 'Possible' },
    { value: 4, label: 'Likely' },
    { value: 5, label: 'Almost Certain' }
  ];

  constructor(private fb: FormBuilder) {
    this.assessmentForm = this.fb.group({
      impact: ['', Validators.required],
      likelihood: ['', Validators.required],
      initialRiskLevel: ['9'],
      residualImpact: ['', Validators.required],
      residualLikelihood: ['', Validators.required],
      residualRiskLevel: ['4']
    });

    // Subscribe to changes for initial risk level
    this.assessmentForm.get('impact')?.valueChanges.subscribe(() => this.calculateInitialRiskLevel());
    this.assessmentForm.get('likelihood')?.valueChanges.subscribe(() => this.calculateInitialRiskLevel());
    
    // Subscribe to changes for residual risk level
    this.assessmentForm.get('residualImpact')?.valueChanges.subscribe(() => this.calculateResidualRiskLevel());
    this.assessmentForm.get('residualLikelihood')?.valueChanges.subscribe(() => this.calculateResidualRiskLevel());
  }

  calculateInitialRiskLevel() {
    const impact = this.assessmentForm.get('impact')?.value;
    const likelihood = this.assessmentForm.get('likelihood')?.value;
    
    if (impact && likelihood) {
      const riskScore = impact * likelihood;
      this.assessmentForm.patchValue({ initialRiskLevel: riskScore.toString() }, { emitEvent: false });
    }
  }

  calculateResidualRiskLevel() {
    const impact = this.assessmentForm.get('residualImpact')?.value;
    const likelihood = this.assessmentForm.get('residualLikelihood')?.value;
    
    if (impact && likelihood) {
      const riskScore = impact * likelihood;
      this.assessmentForm.patchValue({ residualRiskLevel: riskScore.toString() }, { emitEvent: false });
    }
  }
}
