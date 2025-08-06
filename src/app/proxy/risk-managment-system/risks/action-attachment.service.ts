import type { ActionAttachmentDto, UploadActionAttachmentRequest } from './models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { IFormFile } from '../../microsoft/asp-net-core/http/models';
import type { IActionResult } from '../../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class ActionAttachmentService {
  apiName = 'Default';
  

  delete = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/action-attachments/${id}`,
    },
    { apiName: this.apiName,...config });
  

  download = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: `/api/action-attachments/download/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getByMitigationActionId = (mitigationActionId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionAttachmentDto[]>({
      method: 'GET',
      url: `/api/action-attachments/mitigation-action/${mitigationActionId}`,
    },
    { apiName: this.apiName,...config });
  

  getByPreventionActionId = (preventionActionId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionAttachmentDto[]>({
      method: 'GET',
      url: `/api/action-attachments/prevention-action/${preventionActionId}`,
    },
    { apiName: this.apiName,...config });
  

  upload = (file: IFormFile, request: UploadActionAttachmentRequest, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionAttachmentDto>({
      method: 'POST',
      url: '/api/action-attachments/upload',
      body: file,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
