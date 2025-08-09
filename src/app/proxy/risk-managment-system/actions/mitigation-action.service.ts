import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateMitigationActionForConsequenceDto, MitigationActionDto, UpdateMitigationActionDto } from '../risks/dtos/models';

@Injectable({
  providedIn: 'root',
})
export class MitigationActionService {
  apiName = 'Default';
  

  create = (input: CreateMitigationActionForConsequenceDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MitigationActionDto>({
      method: 'POST',
      url: '/api/app/mitigation-action',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MitigationActionDto>({
      method: 'GET',
      url: `/api/app/mitigation-action/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getByConsequenceId = (consequenceId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MitigationActionDto[]>({
      method: 'GET',
      url: `/api/app/mitigation-action/by-consequence-id/${consequenceId}`,
    },
    { apiName: this.apiName,...config });
  

  update = (id: number, input: UpdateMitigationActionDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MitigationActionDto>({
      method: 'PUT',
      url: `/api/app/mitigation-action/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
