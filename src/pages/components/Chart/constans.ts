import translate from '@/locales/translate';
import { ReactNode } from 'react';

export const TABKEYS: Record<API.Category, ReactNode> = {
  platform: translate('platform'),
  credential: translate('cloudAccountLabel'),
  region: translate('region'),
  service: translate('servicesCategory'),
};

export const TABKEYS1: Record<API.Category, ReactNode> = {
  platform: translate('platform'),
  credential: translate('cloudAccountLabel'),
  region: translate('region'),
  service: translate('assetClass'),
};
export const RISKTABKEYS: Record<API.RiskTypeCategory, ReactNode> = {
  config: translate('cloudConfig'),
  vuln: translate('vuln'),
  sensitive: translate('sensitive'),
};

export const RISKS = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'UNKNOWN'].map((v) =>
  translate(v),
);
export const RISK_COLORS = [
  '#9E0000',
  '#ED7676',
  '#F9A363',
  '#FAD264',
  '#8E97A3',
];
export const RISK_COLORS_MAP = {
  CRITICAL: '#9E0000',
  HIGH: '#ED7676',
  MEDIUM: '#F9A363',
  LOW: '#FAD264',
  UNKNOWN: '#8E97A3',
};

export const RISK_LINE_COLORS = [
  '#2D94FF',
  '#7A7DF6',
  '#7DD6F6',
  '#4E7D9E',
  '#FAC117',
  '#F27E7E',
  '#FFAD66',
  '#FFAD66',
  '#B3E05C',
  '#B3E05C',
  '#698DDA',
  '#83A5DC',
  '#95A2AF',
  '#B27AB7',
  '#F58D9A',
  '#AA8CF5',
  '#8CC8FF',
  '#DFC178',
  '#77AEBB',
  '#79BF9E',
];
