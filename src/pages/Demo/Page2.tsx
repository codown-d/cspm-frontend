import TzProTable, {
  TzProColumns,
} from '@/components/lib/ProComponents/TzProTable';
import TzFilter from '@/components/lib/TzFilter';
import useTzFilter, {
  FilterContext,
} from '@/components/lib/TzFilter/useTzFilter';
import TzFilterForm from '@/components/lib/TzFilterForm';
import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import { usePolicTree } from '@/hooks/usePolicTree';
import { getRisks } from '@/services/cspm/CloudPlatform';
import { RISK_OPT } from '@/utils';
import { history, useIntl } from '@umijs/max';
import { cloneDeep, fill, keys, set } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { trans2PluginFilterData } from '../CloudPlatform/util';

function Page2() {
  const [filters, setFilters] = useState<any>();
  const intl = useIntl();
  const columns: TzProColumns<API.RisksDatum>[] = [
    {
      title: intl.formatMessage({ id: 'detectionInfo' }),
      dataIndex: 'name',
      width: '25%',
      tzEllipsis: 2,
    },
    {
      title: intl.formatMessage({ id: 'concreteContent' }),
      dataIndex: 'description',
    },

    {
      title: intl.formatMessage({ id: 'severityLevel' }),
      dataIndex: 'severity',
      align: 'center',
      width: '12%',
    },
  ];
  const { policyTree } = usePolicTree();
  const filterData: FilterFormParam[] = useMemo(
    () => [
      {
        label: intl.formatMessage({ id: 'scanOptions' }),
        name: 'policy_ids',
        type: 'cascader',
        icon: 'icon-dengbaoduiqi',
        props: {
          options: policyTree,
          multiple: true,
        },
      },
      {
        label: intl.formatMessage({ id: 'severityLevel' }),
        name: 'severity',
        type: 'select',
        icon: 'icon-chengdu',
        props: {
          mode: 'multiple',
          options: RISK_OPT,
        },
      },
      {
        label: intl.formatMessage({
          id: 'turnoverTime',
        }),
        name: 'created_at',
        type: 'rangePickerCt',
        icon: 'icon-shijian',
        props: {
          showTime: true,
        },
      },
    ],
    [policyTree],
  );
  const dataFilter = useTzFilter({ initial: filterData });
  const handleChange = useCallback((data: any) => {
    const temp = {};
    keys(data).forEach((key) => {
      let _val = cloneDeep(data[key]);
      if (key === 'policy_ids' && _val) {
        set(
          temp,
          [key],
          trans2PluginFilterData(
            _val,
            policyTree as API.CommonPolicyTreeDatumChild[],
          ),
        );
        return;
      }
      if (key === 'created_at' && _val) {
        _val[0] && set(temp, ['start_at'], +_val[0]);
        _val[1] && set(temp, ['end_at'], +_val[1]);
        return;
      }
      set(temp, [key], _val);
    });
    setFilters(temp);
  }, []);
  return (
    <div>
      <FilterContext.Provider value={{ ...dataFilter }}>
        <TzFilter />
        <TzFilterForm onChange={handleChange} />
      </FilterContext.Provider>
      <TzProTable<API.RisksDatum>
        onRow={(record) => {
          return {
            onClick: () => {
              history.push(`/risks/info/${record.id}`);
            },
          };
        }}
        params={filters}
        request={async ({ pageSize: size, current: page }) => {
          const { total, items } = await getRisks({
            size,
            page,
            ...(filters || {}),
          });
          return { total, data: items || [] };
        }}
        columns={columns}
      />
      <div className="f h-20 overflow-auto bg-red-400 m-8 ">
        {fill(new Array(100), '122222').map((v) => (
          <p>{v}</p>
        ))}
      </div>
    </div>
  );
}

export default Page2;
