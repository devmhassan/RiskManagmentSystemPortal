import type { BusinessDomainDto, BusinessDomainLookupDto } from './dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BusinessDomainService {
  apiName = 'Default';
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, BusinessDomainDto>({
      method: 'GET',
      url: `/api/app/business-domain/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, BusinessDomainDto[]>({
      method: 'GET',
      url: '/api/app/business-domain',
    },
    { apiName: this.apiName,...config });
  

  getLookupList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, BusinessDomainLookupDto[]>({
      method: 'GET',
      url: '/api/app/business-domain/lookup-list',
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
