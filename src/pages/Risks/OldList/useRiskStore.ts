import { useMemoizedFn } from 'ahooks';
import { get, isEqual, set } from 'lodash';
import { useMemo } from 'react';
import { useImmerReducer } from 'use-immer';

type BasicState = {
  task_id?: string;
  filters?: any;
  service_data: {
    service_ids?: string[];
    platform?: string | string[];
  };
};
type RiskStoreProps = {
  risks_static?: API_RISK.RisksStaticResponse;
  credential_id?: number;
  task_id?: string;
  platform?: string | string[];
};
export type TRiskStoreItem = BasicState &
  Pick<RiskStoreProps, 'credential_id' | 'platform'>;
export type TRiskStore = Record<
  'config' | 'vuln' | 'sensitive',
  TRiskStoreItem
>;
enum ActionType {
  UPDATE_SERVICE_DATA = 'UPDATE_SERVICE_DATA',
  UPDATE_FILTERS = 'UPDATE_FILTERS',
}
type UpdateServiceIdsAction = {
  type: ActionType.UPDATE_SERVICE_DATA;
  key: string;
  payload: { service_ids?: string[]; platform?: RiskStoreProps['platform'] };
};
type UpdateFiltersAction = {
  type: ActionType.UPDATE_FILTERS;
  key: string;
  payload: { filters?: any };
};
type FilterDataAction = UpdateServiceIdsAction | UpdateFiltersAction;

export type RiskStoreRes = {
  updateServiceData: (
    key: UpdateServiceIdsAction['key'],
    payload: UpdateServiceIdsAction['payload'],
  ) => void;
  updateFilters: (
    key: UpdateFiltersAction['key'],
    payload: UpdateFiltersAction['payload'],
  ) => void;
  state: TRiskStore;
};
function useRiskStore(props?: RiskStoreProps) {
  const { platform } = props ?? {};
  const initVal = useMemo(
    () => ({ ...props, service_data: { platform, service_ids: undefined } }),
    [props],
  );

  const [state, dispatch] = useImmerReducer<TRiskStore, FilterDataAction>(
    (draft, action) => {
      switch (action.type) {
        case ActionType.UPDATE_SERVICE_DATA:
          !isEqual(action.payload, get(draft, [action.key, 'service_data'])) &&
            set(draft, [action.key, 'service_data'], action.payload);
          break;
        case ActionType.UPDATE_FILTERS:
          !isEqual(action.payload, get(draft, [action.key, 'filters'])) &&
            set(
              draft,
              [action.key, 'filters'],
              (action as UpdateFiltersAction).payload,
            );
          break;
        default:
          console.warn('no action');
      }
    },
    {
      config: initVal,
      vuln: initVal,
      sensitive: initVal,
    },
  );
  const updateServiceData = useMemoizedFn((key, payload) =>
    dispatch({
      type: ActionType.UPDATE_SERVICE_DATA,
      key,
      payload,
    }),
  );
  const updateFilters = useMemoizedFn((key, payload) =>
    dispatch({ type: ActionType.UPDATE_FILTERS, key, payload }),
  );

  return { updateServiceData, updateFilters, state };
}

export default useRiskStore;
