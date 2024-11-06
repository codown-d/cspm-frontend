import { onRowClick } from '@/components/lib/ProComponents/TzProTable';
import { TzButton } from '@/components/lib/tz-button';
import { TzCard } from '@/components/lib/tz-card';
import useCommonFilterItem from '@/hooks/filterItems/useCommonFilterItem';
import useTableAnchor from '@/hooks/useTableAnchor';
import { IState } from '@/interface';
import ActionNodeWithVerify from '@/pages/components/PolicyList/ActionNodeWithVerify';
import PolicyFilters from '@/pages/components/PolicyList/PolicyFilters';
import PolicyTable, {
  PolicyTableRef,
} from '@/pages/components/PolicyList/PolicyTable';
import {
  getAssetsPolicies,
  getHistoryAssetsPolicies,
} from '@/services/cspm/CloudPlatform';
import { toDetailIntercept } from '@/utils';
import { useIntl, useLocation } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import RiskDrawer from '../Info/Config/RiskDrawer';

type IProps = {
  instance_hash_id?: string;
};
function RelevanceList(props: IProps) {
  const { instance_hash_id } = props;
  const [filters, setFilters] = useState<any>();
  const intl = useIntl();
  const ref = useRef<PolicyTableRef>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const listOffsetFn = useTableAnchor(anchorRef);
  const [recordInfo, setRecordInfo] = useState<API.RisksDatum>();
  const { state, pathname } = useLocation();
  const { task_id, from } = (state as IState) ?? {};
  const isHistory = from === 'task';

  const handleChange = useCallback(setFilters, []);

  const refreshList = useMemoizedFn(() => {
    ref.current?.reload();
  });
  const optionals = useMemo(() => {
    if (isHistory) {
      return [
        'description',
        'status',
        {
          name: 'created_at',
          sorter: false,
          label: intl.formatMessage({ id: 'taskCreatedAt' }),
        },
      ];
    }
    return [
      'description',
      'status',
      {
        name: 'updated_at',
        label: intl.formatMessage({ id: 'modifiedTime' }),
      },
    ];
  }, [isHistory]);
  const { scanResItem } = useCommonFilterItem();
  const defaultFilterOpt = useMemo(
    () => ({
      scanResItem,
    }),
    [scanResItem],
  );
  const requestFn = useMemoizedFn(async (dp, sort, filter) => {
    if (!instance_hash_id) {
      return { total: 0, data: [] };
    }

    const apiUrl = isHistory ? getHistoryAssetsPolicies : getAssetsPolicies;
    const { total, items } = await apiUrl({
      ...filters,
      ...dp,
      ...filter,
      ...sort,
    });
    const _virTime = +new Date();
    return { total, data: (items || [])?.map((v) => ({ ...v, _virTime })) };
  });
  return (
    <TzCard
      bodyStyle={{ padding: '0px 16px 16px 16px' }}
      title={intl.formatMessage(
        { id: 'scanresWithName' },
        {
          name: intl.formatMessage({ id: 'riskDiscovery' }),
        },
      )}
      extra={
        <TzButton
          onClick={refreshList}
          type="text"
          size="small"
          icon={<i className="icon iconfont icon-refresh1" />}
        >
          {intl.formatMessage({ id: 'refreshRisk' })}
        </TzButton>
      }
    >
      <PolicyFilters {...defaultFilterOpt} onChange={handleChange} />
      <PolicyTable
        ref={ref}
        params={{ ...filters, task_id, hash_id: instance_hash_id }}
        optionals={optionals}
        request={requestFn}
        onRow={(record) => {
          return {
            onClick: () =>
              onRowClick(() => {
                const calFn = () => {
                  setRecordInfo(record);
                };
                if (isHistory) {
                  calFn();
                } else {
                  toDetailIntercept(
                    {
                      type: 'policy',
                      id: record.policy_id,
                      policy_type: record.policy_type,
                    },
                    calFn,
                  );
                }
              }),
          };
        }}
        renderActionType="verify"
        renderActionBtns={
          isHistory
            ? undefined
            : (_, record) => (
                <ActionNodeWithVerify
                  key={record._virTime}
                  record={{ policy_id: record.policy_id, instance_hash_id }}
                  calFn={refreshList}
                />
              )
        }
        // renderActionBtns={(_, record) =>
        //   record.type === 'manual' ? (
        //     <div className="-ml-2">
        //       <RectifyComplianceRes
        //         id={record.id}
        //         calFn={() => {
        //           refreshList();
        //           message.success(
        //             intl.formatMessage({ id: 'unStand.rectifySuccess' }),
        //           );
        //         }}
        //       />
        //     </div>
        //   ) : (
        //     <TzButton
        //       size="small"
        //       type="text"
        //       onClick={(e) => {
        //         e.stopPropagation();
        //         handlePolicyVerify(record.policy_id);
        //       }}
        //     >
        //       {intl.formatMessage({ id: 'verify' })}
        //     </TzButton>
        //   )
        // }
      />
      <RiskDrawer
        onClose={() => setRecordInfo(undefined)}
        dataSource={recordInfo}
        open={!!recordInfo}
        record={recordInfo}
      />
    </TzCard>
  );
}

export default memo(RelevanceList);
