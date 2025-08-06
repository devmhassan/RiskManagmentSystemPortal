import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BasicInformationComponent } from './basic-information/basic-information.component';
import { RiskAssessmentComponent } from './risk-assessment/risk-assessment.component';
import { BowtieComponentsComponent } from './bowtie-components/bowtie-components.component';

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
export class NewRiskComponent {
  currentStep = 1;
  totalSteps = 3;

  steps = [
    { id: 1, label: 'Basic Information', active: true, completed: false },
    { id: 2, label: 'Risk Assessment', active: false, completed: false },
    { id: 3, label: 'Bowtie Components', active: false, completed: false }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Initialize first step
    this.updateStepStatus();
  }

  goToStep(stepId: number) {
    if (stepId <= this.currentStep || this.steps[stepId - 2]?.completed) {
      this.currentStep = stepId;
      this.updateStepStatus();
      console.log('Current step:', this.currentStep); // Debug log
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
    if (this.currentStep < this.totalSteps) {
      // Mark the current step as completed
      this.steps[this.currentStep - 1].completed = true;
      // Move to the next step
      this.goToStep(this.currentStep + 1);
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.goToStep(this.currentStep - 1);
    }
  }

  onCancel() {
    this.router.navigate(['/risk']);
  }
}
