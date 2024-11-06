import TzFilter from '@/components/lib/TzFilter';
import useTzFilter, {
  FilterContext,
} from '@/components/lib/TzFilter/useTzFilter';
import TzFilterForm from '@/components/lib/TzFilterForm';
import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import useCommonFilterItem from '@/hooks/filterItems/useCommonFilterItem';
import { IAssetTableFilterProps } from '@/pages/components/AssetList/interface';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import { get, isEmpty } from 'lodash';
import { useMemo } from 'react';
import styles from './index.less';
export type IScanScope = {
  filterItems: IAssetTableFilterProps;
  defaultValues?: Record<string, any>;
  onChange?: (arg?: Record<string, any>) => void;
};
function ScanScope(props?: IScanScope) {
  const { onChange, filterItems, defaultValues } = props ?? {};
  const { effectPlatformItem } = useCommonFilterItem();
  const { serviceItem, assetTypeItem, credentialItem, regionItem } =
    filterItems ?? {};

  const filterData = useMemo(
    () =>
      [
        effectPlatformItem,
        serviceItem,
        assetTypeItem,
        credentialItem,
        regionItem,
      ]
        .filter((v) => !!v)
        .map((item) => ({
          ...item,
          value: get(defaultValues, item.name),
        })) as FilterFormParam[],
    [filterItems],
  );

  const dataFilter = useTzFilter({
    initial: filterData,
  });

  const handleChange = useMemoizedFn((data: any) => {
    // const vals = transFilterData2Params(data, {
    //   serviceItem,
    //   assetTypeItem,
    //   regionItem,
    // });
    onChange?.(isEmpty(data) ? undefined : data);
  });
  return (
    <FilterContext.Provider value={{ ...dataFilter }}>
      <div className={classNames(styles.ScanScope)}>
        <TzFilter />
        <TzFilterForm className="align-center-input" onChange={handleChange} />
      </div>
    </FilterContext.Provider>
  );
}

export default ScanScope;
