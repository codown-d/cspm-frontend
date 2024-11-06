import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import useCommonFilterItem from '@/hooks/filterItems/useCommonFilterItem';
import useCredentialFilterItem from '@/hooks/filterItems/useCredentialFilterItem';
import useRegionFilterItem from '@/hooks/filterItems/useRegionFilterItem';
import useServiceFilterItem from '@/hooks/filterItems/useServiceFilterItem';
import useEffectivePlatform from '@/hooks/useEffectivePlatform';
import AssetFilters from '@/pages/components/AssetList/AssetFilters';
import { useMemo } from 'react';

type IProps = {
  platformIds?: string[];
  isScan?: boolean;
  onChange?: (arg?: Record<string, any>) => void;
};
function ListFilters({ platformIds, isScan, onChange }: IProps) {
  const serviceItem = useServiceFilterItem({
    platform: platformIds,
    only_top: 1,
  }) as FilterFormParam;

  const regionItem = useRegionFilterItem({
    platform: platformIds,
  }) as FilterFormParam;

  const { riskTypesItem } = useCommonFilterItem();

  const credentialItem = useCredentialFilterItem();
  const assetTypeItem = useServiceFilterItem({
    platform: platformIds,
  });
  const effectivePlatform = useEffectivePlatform();

  const defaultFilterOpt = useMemo(() => {
    const defaultItems = {
      credentialItem,
      regionItem,
      serviceItem,
      assetTypeItem,
      riskTypesItem,
    };
    return isScan ? { ...defaultItems, effectivePlatform } : defaultItems;
  }, [
    isScan,
    credentialItem,
    regionItem,
    assetTypeItem,
    serviceItem,
    riskTypesItem,
  ]);
  return <AssetFilters {...defaultFilterOpt} onChange={onChange} />;
}

export default ListFilters;
