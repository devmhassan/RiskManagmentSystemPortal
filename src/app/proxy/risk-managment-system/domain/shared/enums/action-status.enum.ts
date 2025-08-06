import { mapEnumToOptions } from '@abp/ng.core';

export enum ActionStatus {
  NotStarted = 1,
  InProgress = 2,
  Completed = 3,
  Delayed = 4,
  Cancelled = 5,
  OnHold = 6,
}

export const actionStatusOptions = mapEnumToOptions(ActionStatus);
