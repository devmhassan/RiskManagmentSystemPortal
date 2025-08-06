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
  businessDomain: string;
  riskOwner: string;
  reviewDate?: string;
  triggerEvents: string[];
  
  // Risk Assessment
  initialLikelihood: Likelihood;
  initialSeverity: Severity;
  residualLikelihood: Likelihood;
  residualSeverity: Severity;
  
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
      residualSeverity: Severity.Moderate,
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

  convertToCreateRiskDto(): CreateRiskDto {
    const formData = this.riskFormDataSubject.value;
    
    if (!this.isFormValid(formData)) {
      throw new Error('Form data is incomplete');
    }

    return {
      riskId: formData.riskId!,
      status: formData.status!,
      description: formData.description!,
      businessDomain: formData.businessDomain!,
      riskOwner: formData.riskOwner!,
      reviewDate: formData.reviewDate,
      triggerEvents: formData.triggerEvents || [],
      initialLikelihood: formData.initialLikelihood!,
      initialSeverity: formData.initialSeverity!,
      residualLikelihood: formData.residualLikelihood!,
      residualSeverity: formData.residualSeverity!,
      causes: formData.causes || [],
      consequences: formData.consequences || []
    };
  }

  private isFormValid(data: Partial<RiskFormData>): data is RiskFormData {
    return !!(
      data.riskId &&
      data.status &&
      data.description &&
      data.businessDomain &&
      data.riskOwner &&
      data.initialLikelihood &&
      data.initialSeverity &&
      data.residualLikelihood &&
      data.residualSeverity
    );
  }

  resetForm() {
    this.initializeForm();
  }
}
