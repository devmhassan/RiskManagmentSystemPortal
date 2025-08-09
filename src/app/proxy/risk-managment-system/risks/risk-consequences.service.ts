import type { ConsequenceDto, CreateConsequenceForRiskDto, UpdateConsequenceForRiskDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RiskConsequencesService {
  apiName = 'Default';
  

  create = (input: CreateConsequenceForRiskDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ConsequenceDto>({
      method: 'POST',
      url: '/api/app/risk-consequences',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/risk-consequences/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ConsequenceDto>({
      method: 'GET',
      url: `/api/app/risk-consequences/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getByRiskId = (riskId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ConsequenceDto[]>({
      method: 'GET',
      url: `/api/app/risk-consequences/by-risk-id/${riskId}`,
    },
    { apiName: this.apiName,...config });
  

  update = (id: number, input: UpdateConsequenceForRiskDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ConsequenceDto>({
      method: 'PUT',
      url: `/api/app/risk-consequences/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
