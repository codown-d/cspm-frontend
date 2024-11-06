import {
  getComplianceHistoryRisks,
  getComplianceRisks,
  getRisk,
} from '@/services/cspm/Risks';
import { NONE_PLATFORM, getValueEnumByFilterOption } from '@/utils';
import { proxy, useSnapshot } from '@umijs/max';
import { useCreation, useMemoizedFn, useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import { isUndefined, omitBy, set } from 'lodash';
import { memo, useMemo, useRef, useState } from 'react';
import PlatformTableTit from '../PlatformTableTit';
import ActionNodeWithVerify from './ActionNodeWithVerify';
import PolicyTable, { PolicyTableProps, PolicyTableRef } from './PolicyTable';
import { IPolicyTableFilterProps } from './interface';

export const riskStore = proxy<Record<string, any>>({});
export type IPolicyListItem = IPolicyTableFilterProps &
  PolicyTableProps & {
    filters?: API.RisksRequest;
    renderActionType?: 'verify' | 'common';
    from: string;
    apiUrl?: (
      params: API_RISK.RiskRequest,
    ) => Promise<API.ResponseWithItems<API_RISK.RiskItem>>;
  };
function PolicyListItem(props: IPolicyListItem) {
  const {
    filters,
    apiUrl = getRisk,
    renderActionType,
    optionals,
    from,
    ...restProps
  } = props;
  const { platform } = filters ?? {};
  const [expanded, setExpandedExpanded] = useState<boolean>(true);
  const ref = useRef<PolicyTableRef>(null);

  const refreshList = useMemoizedFn(() => {
    ref.current?.reload();
  });

  const { refreshLoading } = useSnapshot(riskStore) ?? {};

  useUpdateEffect(() => {
    if (!platform || !refreshLoading) {
      return;
    }
    ref.current?.reload();
    set(riskStore, 'refreshLoading', false);
  }, [refreshLoading]);

  const _filters = useCreation(() => omitBy(filters, isUndefined), [filters]);

  const fetchUrl = useMemo(() => {
    let _fetchUrl = getRisk;
    if (from === 'task') {
      _fetchUrl = getComplianceHistoryRisks;
    } else if (from === 'compliance') {
      _fetchUrl = getComplianceRisks;
    }
    return _fetchUrl;
  }, [from]);
  const requestFn = useMemoizedFn(async (dp, sort, filter) => {
    const _queryData = { ...dp, ...filter, ...sort } as API_RISK.RiskRequest;

    const { total, items } = await fetchUrl(_queryData);
    const { platform: p, size, page, ...retQueryData } = _queryData;
    if (p) {
      set(riskStore, ['filterParams', p], retQueryData);
    }
    const _virTime = +new Date();
    return { total, data: (items || [])?.map((v) => ({ ...v, _virTime })) };
  });
  const _optionals = useMemo(() => {
    return optionals?.map((v) => {
      if (v.name === 'service_ids' && v.serviceItem) {
        return {
          ...v,
          valueEnum: getValueEnumByFilterOption(v.serviceItem, platform),
        };
      }
      if (v.name === 'asset_type_ids' && v.assetTypeItem) {
        return {
          ...v,
          valueEnum: getValueEnumByFilterOption(v.assetTypeItem, platform),
        };
      }

      return v;
    });
  }, [optionals]);
  return (
    <>
      <div className="mt-2 flex items-center">
        <div
          className={classNames('inline-flex items-center text-[#3E4653]', {
            hidden: platform === NONE_PLATFORM,
          })}
        >
          <div
            className={classNames(
              'w-6 h-6 mr-1 inline-flex justify-center items-ceter rounded cursor-pointer hover:bg-[#2177D1]/5 ',
              {
                '-rotate-90': !expanded,
              },
            )}
            onClick={(e) => {
              setExpandedExpanded((prev) => !prev);
              e.stopPropagation();
            }}
          >
            <i
              className={classNames(
                'icon iconfont icon-arrow text-base text-[#8e97a3]',
              )}
            />
          </div>
          <PlatformTableTit platform={platform} />
        </div>
      </div>
      <PolicyTable
        ref={ref}
        className={classNames('', {
          hidden: !expanded,
        })}
        params={_filters}
        request={requestFn}
        {...restProps}
        optionals={_optionals}
        renderActionBtns={
          renderActionType
            ? (_, record) => {
                if (renderActionType === 'verify') {
                  return (
                    <ActionNodeWithVerify
                      key={record._virTime}
                      record={record}
                      calFn={refreshList}
                    />
                  );
                }
                return undefined;
              }
            : undefined
        }
      />
    </>
  );
}

export default memo(PolicyListItem);
