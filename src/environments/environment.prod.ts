import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

const oAuthConfig = {
  issuer: 'https://localhost:44345/',
  redirectUri: baseUrl,
  clientId: 'RiskManagement_App',
  responseType: 'code',
  scope: 'offline_access RiskManagement',
  requireHttps: true,
};

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'RiskManagement',
  },
  oAuthConfig,
  apis: {
    default: {
      url: 'https://localhost:44345',
      rootNamespace: 'RiskManagement',
    },
    AbpAccountPublic: {
      url: oAuthConfig.issuer,
      rootNamespace: 'AbpAccountPublic',
    },
  },
} as Environment;
