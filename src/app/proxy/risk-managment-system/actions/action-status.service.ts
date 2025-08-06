import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { MitigationActionDto, PreventionActionDto } from '../risks/dtos/models';
import type { UpdateActionStatusDto } from '../risks/models';

@Injectable({
  providedIn: 'root',
})
export class ActionStatusService {
  apiName = 'Default';
  

  getMitigationAction = (actionId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MitigationActionDto>({
      method: 'GET',
      url: `/api/app/action-status/mitigation-action/${actionId}`,
    },
    { apiName: this.apiName,...config });
  

  getPreventionAction = (actionId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PreventionActionDto>({
      method: 'GET',
      url: `/api/app/action-status/prevention-action/${actionId}`,
    },
    { apiName: this.apiName,...config });
  

  updateMitigationActionStatus = (actionId: number, input: UpdateActionStatusDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, MitigationActionDto>({
      method: 'PUT',
      url: `/api/app/action-status/mitigation-action-status/${actionId}`,
      body: input,
    },
    { apiName: this.apiName,...config });
  

  updatePreventionActionStatus = (actionId: number, input: UpdateActionStatusDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PreventionActionDto>({
      method: 'PUT',
      url: `/api/app/action-status/prevention-action-status/${actionId}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
