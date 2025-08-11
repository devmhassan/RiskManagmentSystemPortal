import type { EntityDto } from '@abp/ng.core';

export interface BusinessDomainDto extends EntityDto<number> {
  name?: string;
  description?: string;
  isActive: boolean;
}

export interface BusinessDomainLookupDto {
  id: number;
  name?: string;
}
