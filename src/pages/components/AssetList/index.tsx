import { memo } from 'react';
import AssetListItem, { IAssetListItem } from './AssetListItem';

type IAssetList = IAssetListItem & {
  filters?: Omit<API_ASSETS.AssetsRequest, 'page' | 'size'> & {
    platformIds?: string[];
  };
};
function AssetList({ filters, ...rest }: IAssetList) {
  const { platformIds, ...restFilters } = filters ?? {};
  const onlyOne = (platformIds?.length ?? 0) > 1;
  return (
    <div className="items-table">
      {platformIds?.map((key) => (
        <AssetListItem
          key={`${key}-${onlyOne}`}
          isInDetail={onlyOne}
          filters={{
            platform: key,
            ...restFilters,
          }}
          rowEllipsis={false}
          {...rest}
        />
      ))}
    </div>
  );
}

export default memo(AssetList);
