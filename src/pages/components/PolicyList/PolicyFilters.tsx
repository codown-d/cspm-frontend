import TzFilter from '@/components/lib/TzFilter';
import useTzFilter, {
  FilterContext,
} from '@/components/lib/TzFilter/useTzFilter';
import TzFilterForm from '@/components/lib/TzFilterForm';
import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import { transFilterData2Params } from '@/pages/CloudPlatform/util';
import { ActionType } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import { isEqual } from 'lodash';
import { memo, useMemo, useRef } from 'react';
import { IPolicyTableFilterProps } from './interface';

type FilterParams = Omit<API.RisksRequest, 'page' | 'size'>;
type IFilters = IPolicyTableFilterProps & {
  onChange?: (data?: FilterParams) => void;
};
function Filters(props: IFilters) {
  const {
    serviceItem,
    assetTypeItem,
    scanResItem,
    policyTypeItem,
    platformItem,
    credentialItem,
    onChange,
  } = props;
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const anchorRef = useRef<HTMLDivElement>(null);
  const prevValue = useRef<FilterParams>();
  const { riskSeverityOption } = useSeverityEnum();

  const filterData = useMemo(
    () =>
      [
        {
          label: intl.formatMessage({ id: 'unStand.policyTitleAndDesc' }),
          name: 'search',
          type: 'input',
          icon: 'icon-jiance',
          props: {
            placeholder: intl.formatMessage({
              id: 'unStand.policyTitleAndDesc',
            }),
          },
        },
        platformItem,
        serviceItem,
        assetTypeItem,
        credentialItem,
        scanResItem,
        {
          label: intl.formatMessage({ id: 'severityLevel' }),
          name: 'severity',
          type: 'select',
          icon: 'icon-chengdu',
          props: {
            mode: 'multiple',
            options: riskSeverityOption,
          },
        },
        policyTypeItem,
      ].filter((v) => !!v) as FilterFormParam[],
    [
      serviceItem,
      assetTypeItem,
      riskSeverityOption,
      scanResItem,
      policyTypeItem,
      platformItem,
      credentialItem,
    ],
  );

  const dataFilter = useTzFilter({ initial: filterData });

  useUpdateEffect(() => {
    dataFilter.updateFilter(filterData);
  }, [
    assetTypeItem,
    riskSeverityOption,
    serviceItem,
    scanResItem,
    policyTypeItem,
    platformItem,
    credentialItem,
  ]);

  const handleChange = useMemoizedFn((data: any) => {
    const vals = transFilterData2Params(data, {
      serviceItem,
      assetTypeItem,
    }) as FilterParams;

    if (!isEqual(vals, prevValue.current)) {
      onChange?.(vals);
      prevValue.current = vals;
    }
  });
  return (
    <div className="mb-2">
      <FilterContext.Provider value={{ ...dataFilter }}>
        <div className="flex gap-x-[6px]">
          <TzFilter />
          <TzFilterForm
            className="align-center-input"
            onChange={handleChange}
          />
        </div>
      </FilterContext.Provider>
    </div>
  );
}

export default memo(Filters);
