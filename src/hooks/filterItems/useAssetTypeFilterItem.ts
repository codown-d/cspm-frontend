import { useIntl } from '@umijs/max';
import { useMemo } from 'react';

type IAssetTypeFilterItem = {
  services?: (
    | API.CommonServicetreeResponse
    | API.CommonServicetreeResponseChild
  )[];
};

// 资产类型 三级 only_top=undefined
// 若要与云服务有联动，则用useSericeTypeFilterItem
function useAssetTypeFilterItem({ services }: IAssetTypeFilterItem) {
  const intl = useIntl();
  const assetTypeItem = useMemo(
    () => ({
      label: intl.formatMessage({ id: 'assetClass' }),
      name: 'asset_type_ids',
      type: 'cascader',
      icon: 'icon-zhujimingcheng',
      props: {
        multiple: true,
        options: services,
      },
    }),
    [services],
  );

  return assetTypeItem;
}

export default useAssetTypeFilterItem;
