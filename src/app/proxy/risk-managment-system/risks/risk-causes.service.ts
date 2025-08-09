import type { CauseDto, CreateCauseForRiskDto, UpdateCauseForRiskDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RiskCausesService {
  apiName = 'Default';
  

  create = (input: CreateCauseForRiskDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CauseDto>({
      method: 'POST',
      url: '/api/app/risk-causes',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/risk-causes/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CauseDto>({
      method: 'GET',
      url: `/api/app/risk-causes/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getByRiskId = (riskId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CauseDto[]>({
      method: 'GET',
      url: `/api/app/risk-causes/by-risk-id/${riskId}`,
    },
    { apiName: this.apiName,...config });
  

  update = (id: number, input: UpdateCauseForRiskDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CauseDto>({
      method: 'PUT',
      url: `/api/app/risk-causes/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
