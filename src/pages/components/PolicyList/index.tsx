import { memo } from 'react';
import PolicyListItem, { IPolicyListItem } from './PolicyListItem';

type IPolicyList = IPolicyListItem & {
  filters?: Omit<API_ASSETS.AssetsRequest, 'page' | 'size'> & {
    platformIds?: string[];
  };
};
function PolicyList({ filters, ...rest }: IPolicyList) {
  const { platformIds, ...restFilters } = filters ?? {};
  const onlyOne = (platformIds?.length ?? 0) > 1;
  return (
    <div className="items-table">
      {platformIds?.map((key) => (
        <PolicyListItem
          key={`${key}-${onlyOne}`}
          isInDetail={onlyOne}
          filters={{
            platform: key,
            ...restFilters,
          }}
          {...rest}
        />
      ))}
    </div>
  );
}

export default memo(PolicyList);
