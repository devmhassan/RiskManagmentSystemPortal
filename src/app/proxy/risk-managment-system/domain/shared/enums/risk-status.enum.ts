import { mapEnumToOptions } from '@abp/ng.core';

export enum RiskStatus {
  Identified = 1,
  UnderAssessment = 2,
  Assessed = 3,
  Mitigating = 4,
  Mitigated = 5,
  Closed = 6,
  Reopened = 7,
}

export const riskStatusOptions = mapEnumToOptions(RiskStatus);
