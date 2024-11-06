import { onRowClick } from '@/components/lib/ProComponents/TzProTable';
import { TzButton } from '@/components/lib/tz-button';
import { TzCard } from '@/components/lib/tz-card';
import TzFilter from '@/components/lib/TzFilter';
import useTzFilter, {
  FilterContext,
} from '@/components/lib/TzFilter/useTzFilter';
import TzFilterForm from '@/components/lib/TzFilterForm';
import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import useCommonFilterItem from '@/hooks/filterItems/useCommonFilterItem';
import useTagFilterItem from '@/hooks/filterItems/useTagFilterItem';
import { IState } from '@/interface';
import CredentialDrawer from '@/pages/CloudPlatform/Credentials/Info/CredentialDrawer';
import CredentialTable, {
  CredentialTableRef,
} from '@/pages/CloudPlatform/Credentials/List/CredentialTable';
import { transFilterData2Params } from '@/pages/CloudPlatform/util';
import ActionNodeWithVerify from '@/pages/components/PolicyList/ActionNodeWithVerify';
import {
  getComplianceRiskCredentials,
  getCredentials,
  getCredentialsHistory,
  getRiskCredentials,
} from '@/services/cspm/CloudPlatform';
import { toDetailIntercept } from '@/utils';
import { useIntl, useLocation } from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import { Key, useMemo, useRef, useState } from 'react';

type ICredentialWithRisk = {
  policy_id?: string;
  credential_ids?: Key[];
  compliance_content_id?: Key;
  className?: string;
  status?: string;
  policy_type?: string;
};
type TState = IState & {
  compliance_content_id?: string;
  credential_ids?: number[];
  policy_type?: string;
};
function CredentialWithRisk({
  className,
  status,
  ...rest
}: ICredentialWithRisk) {
  const intl = useIntl();
  const { policy_id, policy_type } = rest;
  const [recordInfo, setRecordInfo] = useState();
  const { state } = useLocation();
  const ref = useRef<CredentialTableRef>(null);
  const [filters, setFilters] = useState<any>();
  const { task_id, from = 'risk' } = (state as TState) ?? {};
  const isTask = from === 'task';

  const fetchData = useMemo(() => {
    if (isTask) {
      return {
        fetchUrl: getCredentialsHistory,
        params: { ...rest, task_id: +(task_id ?? -1) },
      };
    }
    if (from === 'risk') {
      return {
        fetchUrl: getRiskCredentials,
      };
    }
    if (from === 'compliance') {
      return {
        fetchUrl: getComplianceRiskCredentials,
      };
    }
    return {
      fetchUrl: getCredentials,
    };
  }, [from]);

  const { effectPlatformItem, scanResItem } = useCommonFilterItem();
  const { tagFilterItem, tags, refreshTags } = useTagFilterItem();
  const filterData: FilterFormParam[] = useMemo(
    () => [
      {
        label: intl.formatMessage({ id: 'accountName' }),
        name: 'search',
        type: 'input',
        icon: 'icon-ziyuan',
      },
      effectPlatformItem,
      tagFilterItem,
      {
        ...scanResItem,
        value: status ? [status] : undefined,
      },
    ],
    [effectPlatformItem, tagFilterItem, status],
  );
  const dataFilter = useTzFilter({ initial: filterData });
  useUpdateEffect(() => {
    dataFilter.updateFilter({ formItems: filterData });
  }, [tagFilterItem]);
  const handleChange = useMemoizedFn((data: any) => {
    setFilters(transFilterData2Params(data, { tagFilterItem }));
  });
  const refreshList = useMemoizedFn(() => {
    ref.current?.reload();
  });

  return (
    <TzCard
      className={className}
      headStyle={{ paddingBottom: 4 }}
      bodyStyle={{ paddingTop: 0 }}
      title={intl.formatMessage({ id: 'influenceCredentials' })}
      extra={
        !isTask && (
          <TzButton
            onClick={refreshList}
            type="text"
            size="small"
            icon={<i className="icon iconfont icon-refresh1" />}
          >
            {intl.formatMessage({ id: 'refreshRisk' })}
          </TzButton>
        )
      }
    >
      <div className="flex mr-2">
        <FilterContext.Provider value={{ ...dataFilter }}>
          <TzFilter />
          <TzFilterForm
            className="ml-[6px] align-center-input"
            onChange={handleChange}
          />
        </FilterContext.Provider>
      </div>
      <CredentialTable
        ref={ref}
        params={filters}
        optionals={[
          'status',
          {
            name: isTask ? 'created_at' : 'updated_at',
            label: intl.formatMessage({
              id: isTask ? 'taskCreatedAt' : 'modifiedTime',
            }),
          },
        ]}
        onRow={(record) => {
          return {
            onClick: (e) =>
              onRowClick(() => {
                e.stopPropagation();
                const fn = () => {
                  setRecordInfo(record);
                };
                if (isTask) {
                  fn();
                  return;
                }
                toDetailIntercept({ type: 'credential', id: record?.id }, fn);
              }),
          };
        }}
        request={async (dp) => {
          let { fetchUrl, params = rest } = fetchData;
          const { total, items } = await fetchUrl({
            ...dp,
            ...params,
          });
          return {
            total,
            data: items || [],
          };
        }}
        renderActionBtns={
          isTask
            ? undefined
            : (_, record) => (
                <ActionNodeWithVerify
                  record={{
                    policy_type,
                    policy_id,
                    credential_id: record.id,
                  }}
                  calFn={() => {
                    ref.current?.reload();
                  }}
                />
              )
        }
      />
      <CredentialDrawer
        open={!!recordInfo}
        onClose={() => setRecordInfo(undefined)}
        record={recordInfo}
      />
    </TzCard>
  );
}

export default CredentialWithRisk;
