import { Key } from 'react';

export type IDashboardState = {
  category: API.Category;
  key: Key;
  platform: string;
  from: string;
  risk_types?: API.RiskTypeCategory;
};
