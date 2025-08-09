import { mapEnumToOptions } from '@abp/ng.core';

export enum Severity {
  Negligible = 1,
  Minor = 2,
  Moderate = 3,
  Major = 4,
  Critical = 5,
}

export const severityOptions = mapEnumToOptions(Severity);
