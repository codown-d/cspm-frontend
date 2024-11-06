import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import { useIntl } from '@umijs/max';
import { flatten } from 'lodash';
import { useMemo } from 'react';
import { useRegion } from '../useRegion';

type RegionFilterItemProps = {
  platform?: string | string[];
};

function useRegionFilterItem(props?: RegionFilterItemProps) {
  const { platform } = props || {};
  const intl = useIntl();
  const regions = useRegion(platform);
  const multiP = useMemo(
    () => !platform || flatten([platform]).length > 1,
    [platform],
  );
  const regionsItem = useMemo(
    () =>
      ({
        label: intl.formatMessage({ id: 'region' }),
        name: 'region_ids',
        type: multiP ? 'cascader' : 'select',
        icon: 'icon-weizhi',
        props: multiP
          ? {
              multiple: true,
              options: regions,
            }
          : {
              mode: 'multiple',
              options: regions,
            },
      }) as FilterFormParam,
    [multiP, regions],
  );

  return regionsItem;
}

export default useRegionFilterItem;
