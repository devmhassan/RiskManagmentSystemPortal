import { mapEnumToOptions } from '@abp/ng.core';

export enum ActionType {
  Preventive = 1,
  Mitigation = 2,
}

export const actionTypeOptions = mapEnumToOptions(ActionType);
