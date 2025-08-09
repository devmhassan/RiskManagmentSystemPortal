import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RiskFormService } from '../../services/risk-form.service';
import { RiskStatus, riskStatusOptions } from '../../../proxy/risk-managment-system/domain/shared/enums/risk-status.enum';

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class BasicInformationComponent implements OnInit {
  basicInfoForm: FormGroup;
  triggerEvents: string[] = [];
  private isUpdatingFromService = false; // Guard to prevent circular updates
  
  // Dropdown options
  businessDomains = ['Finance', 'Healthcare', 'IT', 'Operations', 'Sales', 'Marketing', 'HR', 'Legal'];
  riskStatusOptions = riskStatusOptions;
  RiskStatus = RiskStatus;

  constructor(
    private fb: FormBuilder,
    private riskFormService: RiskFormService
  ) {
    this.basicInfoForm = this.fb.group({
      riskId: ['', [Validators.required, Validators.pattern(/^[A-Z]{2,3}-\d{4}$/)]],
      status: [RiskStatus.Identified, Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      businessDomain: ['', Validators.required],
      riskOwner: ['', [Validators.required, Validators.email]],
      reviewDate: ['', Validators.required],
      triggerEventInput: ['']
    });
  }

  ngOnInit() {
    // Load existing form data if available
    this.riskFormService.riskFormData$.subscribe(data => {
      if (data.riskId) {
        this.isUpdatingFromService = true; // Set guard before patching
        this.basicInfoForm.patchValue({
          riskId: data.riskId,
          status: data.status,
          description: data.description,
          businessDomain: data.businessDomain,
          riskOwner: data.riskOwner,
          reviewDate: data.reviewDate
        });
        this.triggerEvents = data.triggerEvents || [];
        this.isUpdatingFromService = false; // Clear guard after patching
      }
    });

    // Subscribe to form changes to update the service with guard
    this.basicInfoForm.valueChanges.subscribe(() => {
      if (!this.isUpdatingFromService) {
        this.updateFormData();
      }
    });
  }

  addTriggerEvent() {
    const triggerEvent = this.basicInfoForm.get('triggerEventInput')?.value;
    if (triggerEvent && triggerEvent.trim() && !this.triggerEvents.includes(triggerEvent.trim())) {
      this.triggerEvents.push(triggerEvent.trim());
      this.basicInfoForm.patchValue({ triggerEventInput: '' });
      this.updateFormData();
    }
  }

  removeTriggerEvent(index: number) {
    this.triggerEvents.splice(index, 1);
    this.updateFormData();
  }

  private updateFormData() {
    if (this.basicInfoForm.valid) {
      const formValue = this.basicInfoForm.value;
      this.riskFormService.updateBasicInformation({
        riskId: formValue.riskId,
        status: formValue.status,
        description: formValue.description,
        businessDomain: formValue.businessDomain,
        riskOwner: formValue.riskOwner,
        reviewDate: formValue.reviewDate,
        triggerEvents: this.triggerEvents
      });
    }
  }

  // Validation helper methods
  get riskIdInvalid() {
    const control = this.basicInfoForm.get('riskId');
    return control?.invalid && (control?.dirty || control?.touched);
  }

  get descriptionInvalid() {
    const control = this.basicInfoForm.get('description');
    return control?.invalid && (control?.dirty || control?.touched);
  }

  get riskOwnerInvalid() {
    const control = this.basicInfoForm.get('riskOwner');
    return control?.invalid && (control?.dirty || control?.touched);
  }

  isFormValid(): boolean {
    return this.basicInfoForm.valid;
  }
}
