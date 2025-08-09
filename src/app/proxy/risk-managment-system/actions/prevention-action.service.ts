import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { PreventionActionDto, UpdatePreventionActionDto } from '../risks/dtos/models';

@Injectable({
  providedIn: 'root',
})
export class PreventionActionService {
  apiName = 'Default';
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PreventionActionDto>({
      method: 'GET',
      url: `/api/app/prevention-action/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getByCauseId = (causeId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PreventionActionDto[]>({
      method: 'GET',
      url: `/api/app/prevention-action/by-cause-id/${causeId}`,
    },
    { apiName: this.apiName,...config });
  

  update = (id: number, input: UpdatePreventionActionDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PreventionActionDto>({
      method: 'PUT',
      url: `/api/app/prevention-action/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
