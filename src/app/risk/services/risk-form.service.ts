import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CreateRiskDto, CreateCauseDto, CreateConsequenceDto } from '../../proxy/risk-managment-system/risks/dtos/models';
import { RiskStatus } from '../../proxy/risk-managment-system/domain/shared/enums/risk-status.enum';
import { Likelihood } from '../../proxy/risk-managment-system/domain/shared/enums/likelihood.enum';
import { Severity } from '../../proxy/risk-managment-system/domain/shared/enums/severity.enum';

export interface RiskFormData {
  // Basic Information
  riskId: string;
  status: RiskStatus;
  description: string;
  businessDomainId: number;
  riskOwner: string;
  reviewDate?: string;
  triggerEvents: string[];
  
  // Risk Assessment
  initialLikelihood: Likelihood;
  initialSeverity: Severity;
  residualLikelihood: Likelihood | number;
  residualSeverity: Severity | number;
  residualRiskLevel?: number;
  
  // Bowtie Components
  causes: CreateCauseDto[];
  consequences: CreateConsequenceDto[];
}

@Injectable({
  providedIn: 'root'
})
export class RiskFormService {
  private riskFormDataSubject = new BehaviorSubject<Partial<RiskFormData>>({});
  public riskFormData$ = this.riskFormDataSubject.asObservable();

  constructor() {
    this.initializeForm();
  }

  initializeForm() {
    const initialData: Partial<RiskFormData> = {
      status: RiskStatus.Identified,
      triggerEvents: [],
      initialLikelihood: Likelihood.Possible,
      initialSeverity: Severity.Moderate,
      residualLikelihood: Likelihood.Possible,
      residualSeverity:  Severity.Moderate,
      residualRiskLevel: this.calculateResidualRiskLevel(0, 0),
      causes: [],
      consequences: []
    };
    this.riskFormDataSubject.next(initialData);
  }

  updateBasicInformation(data: Partial<RiskFormData>) {
    const currentData = this.riskFormDataSubject.value;
    this.riskFormDataSubject.next({
      ...currentData,
      ...data
    });
  }

  updateRiskAssessment(data: Partial<RiskFormData>) {
    const currentData = this.riskFormDataSubject.value;
    this.riskFormDataSubject.next({
      ...currentData,
      ...data
    });
  }

  updateBowtieComponents(data: Partial<RiskFormData>) {
    const currentData = this.riskFormDataSubject.value;
    this.riskFormDataSubject.next({
      ...currentData,
      ...data
    });
  }

  getCurrentFormData(): Partial<RiskFormData> {
    return this.riskFormDataSubject.value;
  }

  // Helper method to calculate residual risk level
  calculateResidualRiskLevel(likelihood: number, severity: number): number {
    return likelihood * severity;
  }

  convertToCreateRiskDto(): CreateRiskDto {
    const formData = this.riskFormDataSubject.value;
    
    if (!this.isFormValid(formData)) {
      throw new Error('Form data is incomplete');
    }

    // Calculate residual risk level using helper method
    const residualLikelihood = (formData.residualLikelihood as any) || 0;
    const residualSeverity = (formData.residualSeverity as any) || 0;

    return {
      riskId: formData.riskId!,
      status: formData.status || RiskStatus.Identified, // Ensure status always has a value
      description: formData.description!,
      businessDomainId: formData.businessDomainId!,
      riskOwner: formData.riskOwner!,
      reviewDate: formData.reviewDate,
      triggerEvents: formData.triggerEvents || [],
      initialLikelihood: formData.initialLikelihood!,
      initialSeverity: formData.initialSeverity!,
      residualLikelihood: residualLikelihood,
      residualSeverity: residualSeverity,
      causes: formData.causes || [],
      consequences: formData.consequences || []
    };
  }

  private isFormValid(data: Partial<RiskFormData>): data is RiskFormData {
    // Check basic fields
    const basicFieldsValid = !!(
      data.riskId &&
      (data.status || data.status === RiskStatus.Identified) && // Handle status defaulting
      data.description &&
      data.businessDomainId &&
      data.riskOwner &&
      data.reviewDate &&
      data.triggerEvents && 
      data.triggerEvents.length > 0 &&
      data.initialLikelihood &&
      data.initialSeverity &&
      (data.residualLikelihood !== undefined) && // Accept 0 as valid
      (data.residualSeverity !== undefined) // Accept 0 as valid
    );

    // Check bowtie components
    const hasCauses = data.causes && data.causes.length > 0 && 
      data.causes.every(cause => cause.description && cause.description.trim().length > 0);
    
    const hasConsequences = data.consequences && data.consequences.length > 0 && 
      data.consequences.every(consequence => consequence.description && consequence.description.trim().length > 0);

    return basicFieldsValid && hasCauses && hasConsequences;
  }

  // Step validation methods
  isBasicInformationValid(): boolean {
    const data = this.riskFormDataSubject.value;
    return !!(
      data.riskId &&
      data.status &&
      data.description &&
      data.businessDomainId &&
      data.riskOwner &&
      data.reviewDate &&
      data.triggerEvents && 
      data.triggerEvents.length > 0
    );
  }

  isRiskAssessmentValid(): boolean {
    const data = this.riskFormDataSubject.value;
    return !!(
      data.initialLikelihood &&
      data.initialSeverity &&
      (data.residualLikelihood !== undefined) && // Accept 0 as valid
      (data.residualSeverity !== undefined) // Accept 0 as valid
    );
  }

  isBowtieComponentsValid(): boolean {
    const data = this.riskFormDataSubject.value;
    
    // Check if we have causes and consequences with proper descriptions
    const hasCauses = data.causes && data.causes.length > 0 && 
      data.causes.every(cause => cause.description && cause.description.trim().length > 0);
    
    const hasConsequences = data.consequences && data.consequences.length > 0 && 
      data.consequences.every(consequence => consequence.description && consequence.description.trim().length > 0);
    
    return hasCauses && hasConsequences;
  }

  resetForm() {
    this.initializeForm();
  }
}
