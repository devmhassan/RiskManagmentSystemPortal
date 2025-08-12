import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RiskFormService } from '../../services/risk-form.service';
import { RiskStatus, riskStatusOptions } from '../../../proxy/risk-managment-system/domain/shared/enums/risk-status.enum';
import { BusinessDomainService } from '../../../proxy/risk-managment-system/lookups/business-domain.service';
import { BusinessDomainLookupDto } from '../../../proxy/risk-managment-system/lookups/dtos';

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
  minDate: string; // Minimum date for the date picker
  
  // Dropdown options
  businessDomains: BusinessDomainLookupDto[] = [];
  riskStatusOptions = riskStatusOptions;
  RiskStatus = RiskStatus;

  constructor(
    private fb: FormBuilder,
    private riskFormService: RiskFormService,
    private businessDomainService: BusinessDomainService
  ) {
    // Set minimum date to today
    this.minDate = new Date().toISOString().split('T')[0];
    
    this.basicInfoForm = this.fb.group({
      riskId: ['', Validators.required],
      status: [RiskStatus.Identified, Validators.required],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      businessDomainId: ['', Validators.required],
      riskOwner: ['', [Validators.required, Validators.email]],
      reviewDate: ['', [Validators.required, this.pastDateValidator]],
      triggerEventInput: ['']
    });
  }

  ngOnInit() {
    // Load business domains from backend
    this.loadBusinessDomains();
    
    // Load existing form data if available
    this.riskFormService.riskFormData$.subscribe(data => {
      if (data.riskId) {
        this.isUpdatingFromService = true; // Set guard before patching
        this.basicInfoForm.patchValue({
          riskId: data.riskId,
          status: data.status,
          description: data.description,
          businessDomainId: data.businessDomainId,
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
    const formValue = this.basicInfoForm.value;
    this.riskFormService.updateBasicInformation({
      riskId: formValue.riskId,
      status: formValue.status || RiskStatus.Identified, // Ensure status always has a value
      description: formValue.description,
      businessDomainId: formValue.businessDomainId,
      riskOwner: formValue.riskOwner,
      reviewDate: formValue.reviewDate,
      triggerEvents: this.triggerEvents,
      // Ensure residual fields always send 0
      residualLikelihood: 0,
      residualSeverity: 0,
      residualRiskLevel: 0
    });
  }

  isFormValid(): boolean {
    return this.basicInfoForm.valid && this.triggerEvents.length > 0;
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

  get reviewDateInvalid() {
    const control = this.basicInfoForm.get('reviewDate');
    return control?.invalid && (control?.dirty || control?.touched);
  }

  // Custom validator for past dates
  pastDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Don't validate empty values here, let required validator handle it
    }

    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates

    if (selectedDate < today) {
      return { pastDate: true };
    }

    return null;
  }

  private loadBusinessDomains() {
    this.businessDomainService.getLookupList().subscribe({
      next: (domains) => {
        this.businessDomains = domains;
      },
      error: (error) => {
        console.error('Error loading business domains:', error);
        // Fallback to empty array or show error message
        this.businessDomains = [];
      }
    });
  }
}
