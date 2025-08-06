import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ActionCommentDto, CreateActionCommentDto } from '../risks/models';

@Injectable({
  providedIn: 'root',
})
export class ActionCommentService {
  apiName = 'Default';
  

  create = (input: CreateActionCommentDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionCommentDto>({
      method: 'POST',
      url: '/api/app/action-comment',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/action-comment/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getByMitigationActionId = (mitigationActionId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionCommentDto[]>({
      method: 'GET',
      url: `/api/app/action-comment/by-mitigation-action-id/${mitigationActionId}`,
    },
    { apiName: this.apiName,...config });
  

  getByPreventionActionId = (preventionActionId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionCommentDto[]>({
      method: 'GET',
      url: `/api/app/action-comment/by-prevention-action-id/${preventionActionId}`,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
