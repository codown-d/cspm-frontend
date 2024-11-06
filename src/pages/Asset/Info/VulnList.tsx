import { onRowClick } from '@/components/lib/ProComponents/TzProTable';
import TzFilter from '@/components/lib/TzFilter';
import useTzFilter, {
  FilterContext,
} from '@/components/lib/TzFilter/useTzFilter';
import TzFilterForm from '@/components/lib/TzFilterForm';
import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import { TzCard } from '@/components/lib/tz-card';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import useCommonFilterItem from '@/hooks/filterItems/useCommonFilterItem';
import useTableAnchor from '@/hooks/useTableAnchor';
import { IState } from '@/interface';
import VulnRiskDrawer from '@/pages/Vuln/Info/VulnRiskDrawer';
import VulnTable from '@/pages/Vuln/List/VulnTable';
import { getVulnRisks } from '@/services/cspm/CloudPlatform';
import { useIntl, useLocation } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { memo, useMemo, useRef, useState } from 'react';

type TVulnRiskList = {
  instance_hash_ids?: string;
};
function VulnList(props: TVulnRiskList) {
  const { instance_hash_ids } = props;
  const { state, pathname } = useLocation();
  const { task_id, from } = (state as IState) ?? {};
  const isHistory = from === 'task';
  const { severityOption, getSeverityTagInfoByStatus: getTagInfoByStatus } =
    useSeverityEnum();
  const [recordInfo, setRecordInfo] = useState<API_AGENTLESS.VulnRisksDatum>();

  const [filters, setFilters] = useState<any>();
  const intl = useIntl();
  const anchorRef = useRef<HTMLDivElement>(null);
  const listOffsetFn = useTableAnchor(anchorRef);
  const { attackPathItem } = useCommonFilterItem();

  const filterData: FilterFormParam[] = useMemo(
    () =>
      [
        {
          label: intl.formatMessage({ id: 'unStand.vulnSearch' }),
          name: 'search',
          type: 'input',
          icon: 'icon-bianhao',
        },
        attackPathItem,
        {
          label: intl.formatMessage({ id: 'severityLevel' }),
          name: 'severity',
          type: 'select',
          icon: 'icon-chengdu',
          props: {
            mode: 'multiple',
            options: severityOption,
          },
        },
      ] as FilterFormParam[],
    [],
  );

  const data = useTzFilter({ initial: filterData });

  const handleChange = useMemoizedFn(setFilters);

  return (
    <TzCard
      bodyStyle={{ padding: '4px 16px 16px 16px' }}
      className="mt-3"
      title={intl.formatMessage(
        { id: 'scanresWithName' },
        {
          name: intl.formatMessage({ id: 'vuln' }),
        },
      )}
    >
      {/* <div className="absolute -top-[74px]" ref={anchorRef} /> */}
      <FilterContext.Provider value={{ ...data }}>
        <div className="flex gap-x-[6px] mb-2">
          <TzFilter />
          <TzFilterForm
            className="align-center-input"
            onChange={handleChange}
          />
        </div>
      </FilterContext.Provider>
      <VulnTable
        onChange={listOffsetFn}
        onRow={(record) => {
          return {
            onClick: () =>
              onRowClick(() => {
                setRecordInfo(record);
              }),
          };
        }}
        optionals={['title', 'updated_at']}
        params={{ ...filters, instance_hash_ids, task_id }}
        request={async (dp) => {
          const { total, items } = await getVulnRisks({
            ...dp,
          });
          return { total, data: items || [] };
        }}
      />
      <VulnRiskDrawer
        onClose={() => setRecordInfo(undefined)}
        dataSource={recordInfo}
        open={!!recordInfo}
        record={recordInfo}
      />
    </TzCard>
  );
}

export default memo(VulnList);
