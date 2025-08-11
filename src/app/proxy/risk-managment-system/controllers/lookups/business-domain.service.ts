import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BusinessDomainDto, BusinessDomainLookupDto } from '../../lookups/dtos/models';

@Injectable({
  providedIn: 'root',
})
export class BusinessDomainService {
  apiName = 'Default';
  

  get = (id: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, BusinessDomainDto>({
      method: 'GET',
      url: `/api/lookups/business-domains/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, BusinessDomainDto[]>({
      method: 'GET',
      url: '/api/lookups/business-domains',
    },
    { apiName: this.apiName,...config });
  

  getLookupList = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, BusinessDomainLookupDto[]>({
      method: 'GET',
      url: '/api/lookups/business-domains/lookup',
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
