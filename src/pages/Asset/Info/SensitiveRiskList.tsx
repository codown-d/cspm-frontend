import { TzCard } from '@/components/lib/tz-card';
import TzFilter from '@/components/lib/TzFilter';
import useTzFilter, {
  FilterContext,
} from '@/components/lib/TzFilter/useTzFilter';
import TzFilterForm from '@/components/lib/TzFilterForm';
import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import useRuleSensitiveRisks from '@/hooks/useRuleSensitiveRisks';
import useTableAnchor from '@/hooks/useTableAnchor';
import { IState } from '@/interface';
import SensitiveTable from '@/pages/Sensitive/List/SensitiveTable';
import { getSensitiveRisks } from '@/services/cspm/CloudPlatform';
import { ActionType } from '@ant-design/pro-components';
import { useIntl, useLocation, useModel } from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import { memo, useMemo, useRef, useState } from 'react';

function SensitiveRiskList(props: { instance_hash_ids?: string }) {
  const { instance_hash_ids } = props;
  const { state } = useLocation();
  const { task_id } = (state as IState) ?? {};
  const [filters, setFilters] = useState<any>();
  const intl = useIntl();
  const listRef = useRef(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<ActionType>();
  const listOffsetFn = useTableAnchor(anchorRef);
  const ruleSensitiveRisks = useRuleSensitiveRisks();
  const { commonConst } = useModel('global') ?? {};
  const {
    secretSeverityOption,
    getSeverityTagInfoByStatus: getTagInfoByStatus,
  } = useSeverityEnum();

  const filterData: FilterFormParam[] = useMemo(
    () => [
      {
        label: intl.formatMessage({ id: 'sensitiveInformationRule' }),
        name: 'rule_title',
        type: 'input',
        icon: 'icon-xingzhuangjiehe',
      },
      // ToDo： 文件类型
      {
        label: intl.formatMessage({ id: 'informationType' }),
        name: 'rule_category',
        type: 'select',
        icon: 'icon-leixing',
        props: {
          mode: 'multiple',
          options: ruleSensitiveRisks,
        },
      },
      {
        label: intl.formatMessage({ id: 'severityLevel' }),
        name: 'severity',
        type: 'select',
        icon: 'icon-chengdu',
        props: {
          mode: 'multiple',
          options: secretSeverityOption,
        },
      },
    ],
    [ruleSensitiveRisks],
  );
  const dataFilter = useTzFilter({ initial: filterData });

  useUpdateEffect(() => {
    dataFilter.updateFilter({ formItems: filterData });
  }, [ruleSensitiveRisks]);

  const handleChange = useMemoizedFn(setFilters);

  return (
    <TzCard
      bodyStyle={{ padding: '4px 16px 16px 16px' }}
      className="mt-3"
      title={intl.formatMessage(
        { id: 'scanresWithName' },
        {
          name: intl.formatMessage({ id: 'certificateKey' }),
        },
      )}
    >
      {/* <div className="absolute -top-[74px]" ref={anchorRef} /> */}
      <FilterContext.Provider value={{ ...dataFilter }}>
        <div className="flex gap-x-[6px] mb-2">
          <TzFilter />
          <TzFilterForm
            className="align-center-input"
            onChange={handleChange}
          />
        </div>
      </FilterContext.Provider>
      <SensitiveTable
        optionals={['updated_at']}
        onChange={listOffsetFn}
        rowKey="unique_id"
        className="no-hover-table"
        actionRef={actionRef}
        params={{ ...filters, instance_hash_ids, task_id }}
        request={async (dp) => {
          const { total, items } = await getSensitiveRisks({
            ...dp,
          });
          return { total, data: items || [] };
        }}
      />
    </TzCard>
  );
}

export default memo(SensitiveRiskList);
