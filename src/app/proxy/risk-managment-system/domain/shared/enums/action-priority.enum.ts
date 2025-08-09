import { mapEnumToOptions } from '@abp/ng.core';

export enum ActionPriority {
  Low = 1,
  Medium = 2,
  High = 3,
  Urgent = 4,
  Immediate = 5,
}

export const actionPriorityOptions = mapEnumToOptions(ActionPriority);
