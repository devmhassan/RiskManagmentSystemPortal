import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ActionAttachmentDto, UploadActionAttachmentDto } from '../risks/models';

@Injectable({
  providedIn: 'root',
})
export class ActionAttachmentService {
  apiName = 'Default';
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/action-attachment/${id}`,
    },
    { apiName: this.apiName,...config });
  

  download = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, Blob>({
      method: 'POST',
      responseType: 'blob',
      url: `/api/app/action-attachment/${id}/download`,
    },
    { apiName: this.apiName,...config });
  

  getByMitigationActionId = (mitigationActionId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionAttachmentDto[]>({
      method: 'GET',
      url: `/api/app/action-attachment/by-mitigation-action-id/${mitigationActionId}`,
    },
    { apiName: this.apiName,...config });
  

  getByPreventionActionId = (preventionActionId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionAttachmentDto[]>({
      method: 'GET',
      url: `/api/app/action-attachment/by-prevention-action-id/${preventionActionId}`,
    },
    { apiName: this.apiName,...config });
  

  upload = (input: UploadActionAttachmentDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionAttachmentDto>({
      method: 'POST',
      url: '/api/app/action-attachment/upload',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
