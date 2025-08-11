import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ActionType } from '../domain/shared/enums/action-type.enum';
import type { ActionDetailsDto } from '../risks/dtos/models';

@Injectable({
  providedIn: 'root',
})
export class ActionDetailsService {
  apiName = 'Default';
  

  getActionDetails = (actionType: ActionType, actionId: number, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ActionDetailsDto>({
      method: 'GET',
      url: `/api/app/action-details/action-details/${actionId}`,
      params: { actionType },
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
