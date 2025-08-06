import { mapEnumToOptions } from '@abp/ng.core';

export enum Likelihood {
  Rare = 1,
  Unlikely = 2,
  Possible = 3,
  Likely = 4,
  AlmostCertain = 5,
}

export const likelihoodOptions = mapEnumToOptions(Likelihood);
