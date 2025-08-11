import type { ActionDetailsDto, ActionStatusSummaryDto, ActionTrackerItemDto, ActionTrackerStatsDto, CostBenefitAnalysisDto, CreateRiskDto, DashboardStatsDto, RiskDto, RiskMatrixDto, UpdateRiskDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ActionType } from '../domain/shared/enums/action-type.enum';

@Injectable({
  providedIn: 'root',
})
export class RiskService {
  apiName = 'Default';
  

  create = (input: CreateRiskDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RiskDto>({
      method: 'POST',
      url: '/api/app/risk',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RiskDto>({
      method: 'GET',
      url: `/api/app/risk/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getActionDetails = (actionType: ActionType, actionId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionDetailsDto>({
      method: 'GET',
      url: `/api/app/risk/action-details/${actionId}`,
      params: { actionType },
    },
    { apiName: this.apiName,...config });
  

  getActionTrackerStats = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionTrackerStatsDto>({
      method: 'GET',
      url: '/api/app/risk/action-tracker-stats',
    },
    { apiName: this.apiName,...config });
  

  getByRiskId = (riskId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RiskDto>({
      method: 'GET',
      url: `/api/app/risk/by-risk-id/${riskId}`,
    },
    { apiName: this.apiName,...config });
  

  getCostBenefitAnalysis = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CostBenefitAnalysisDto>({
      method: 'GET',
      url: `/api/app/risk/${id}/cost-benefit-analysis`,
    },
    { apiName: this.apiName,...config });
  

  getDashboardStats = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DashboardStatsDto>({
      method: 'GET',
      url: '/api/app/risk/dashboard-stats',
    },
    { apiName: this.apiName,...config });
  

  getHighRiskList = (minimumRiskLevel: number = 15, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RiskDto[]>({
      method: 'GET',
      url: '/api/app/risk/high-risk-list',
      params: { minimumRiskLevel },
    },
    { apiName: this.apiName,...config });
  

  getList = (searchText?: string, includeDetails: boolean = true, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RiskDto[]>({
      method: 'GET',
      url: '/api/app/risk',
      params: { searchText, includeDetails },
    },
    { apiName: this.apiName,...config });
  

  getListByBusinessDomain = (businessDomainId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RiskDto[]>({
      method: 'GET',
      url: `/api/app/risk/by-business-domain/${businessDomainId}`,
    },
    { apiName: this.apiName,...config });
  

  getRiskActionStatusSummary = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionStatusSummaryDto>({
      method: 'GET',
      url: `/api/app/risk/${id}/risk-action-status-summary`,
    },
    { apiName: this.apiName,...config });
  

  getRiskActions = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionTrackerItemDto[]>({
      method: 'GET',
      url: `/api/app/risk/${id}/risk-actions`,
    },
    { apiName: this.apiName,...config });
  

  getRiskMatrix = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, RiskMatrixDto>({
      method: 'GET',
      url: '/api/app/risk/risk-matrix',
    },
    { apiName: this.apiName,...config });
  

  getRisksByOwner = (riskOwner: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RiskDto[]>({
      method: 'GET',
      url: '/api/app/risk/risks-by-owner',
      params: { riskOwner },
    },
    { apiName: this.apiName,...config });
  

  getRisksRequiringReview = (cutoffDate?: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RiskDto[]>({
      method: 'GET',
      url: '/api/app/risk/risks-requiring-review',
      params: { cutoffDate },
    },
    { apiName: this.apiName,...config });
  

  update = (input: UpdateRiskDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, RiskDto>({
      method: 'PUT',
      url: '/api/app/risk',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
