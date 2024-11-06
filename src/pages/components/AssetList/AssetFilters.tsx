import TzFilter from '@/components/lib/TzFilter';
import useTzFilter, {
  FilterContext,
} from '@/components/lib/TzFilter/useTzFilter';
import TzFilterForm from '@/components/lib/TzFilterForm';
import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import { transFilterData2Params } from '@/pages/CloudPlatform/util';
import { ActionType } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import { isEqual } from 'lodash';
import { memo, useMemo, useRef } from 'react';
import { IAssetTableFilterProps } from './interface';

type FilterParams = Omit<API_ASSETS.AssetsRequest, 'page' | 'size'>;
type IFilters = IAssetTableFilterProps & {
  className?: string;
  onChange?: (data?: FilterParams, originData?: Record<string, any>) => void;
};
const Filters = (props: IFilters) => {
  const {
    serviceItem,
    credentialItem,
    riskTypesItem,
    regionItem,
    assetTypeItem,
    scanResItem,
    onChange,
    className,
  } = props;
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const anchorRef = useRef<HTMLDivElement>(null);
  const prevValue = useRef<FilterParams>();

  const filterData = useMemo(
    () =>
      [
        {
          label: intl.formatMessage({ id: 'instanceId' }),
          name: 'search',
          type: 'input',
          icon: 'icon-bianhao',
          props: {
            placeholder: intl.formatMessage({ id: 'unStand.instanceSearch' }),
          },
        },
        serviceItem,
        assetTypeItem,
        credentialItem,
        riskTypesItem,
        regionItem,
        scanResItem,
      ].filter((v) => !!v) as FilterFormParam[],
    [
      credentialItem,
      assetTypeItem,
      serviceItem,
      regionItem,
      scanResItem,
      riskTypesItem,
    ],
  );

  const dataFilter = useTzFilter({ initial: filterData });

  useUpdateEffect(() => {
    dataFilter.updateFilter(filterData);
  }, [
    regionItem,
    assetTypeItem,
    scanResItem,
    serviceItem,
    credentialItem,
    riskTypesItem,
  ]);

  const handleChange = useMemoizedFn((data: any) => {
    const vals = transFilterData2Params(data, {
      serviceItem,
      regionItem,
      assetTypeItem,
    }) as FilterParams;

    if (!isEqual(vals, prevValue.current)) {
      onChange?.(vals, data);
      prevValue.current = vals;
    }
  });
  return (
    <FilterContext.Provider value={{ ...dataFilter }}>
      <div className={classNames('flex gap-x-[6px]', className)}>
        <TzFilter />
        <TzFilterForm className="align-center-input" onChange={handleChange} />
      </div>
    </FilterContext.Provider>
  );
};

export default memo(Filters);
