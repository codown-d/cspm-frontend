import { proxy } from '@umijs/max';
import { keys } from 'lodash';
type IKey = 'servicetree' | 'risk' | 'risks_static';
export type IRiskRefreshStatus = Record<IKey, boolean>;
const defaultVal: IRiskRefreshStatus = {
  servicetree: false,
  risk: false,
  risks_static: false,
};
export const riskRefreshStatus = proxy<IRiskRefreshStatus>(defaultVal);

export const requestStoreAction = {
  update: (key: IKey, val: boolean) => {
    riskRefreshStatus[key] = val;
  },
  clear: () =>
    (keys(defaultVal) as IKey[]).forEach((key) => {
      riskRefreshStatus[key] = defaultVal[key];
    }),
};
