import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import { useIntl } from '@umijs/max';
import { flatten } from 'lodash';
import { useMemo } from 'react';
import useServiceTree from '../useServiceTree';

type IServiceFilterItem = {
  platform?: string | string[];
  only_top?: number;
  // service_ids?: string[];
  // services?: (
  //   | API.CommonServicetreeResponse
  //   | API.CommonServicetreeResponseChild
  // )[];
};

// 云服务 二级 only_top=1
// 资产类型 only_top=undefined
function useServiceFilterItem(props?: IServiceFilterItem) {
  const { platform, only_top } = props ?? {};
  const intl = useIntl();
  const services = useServiceTree(platform, only_top);
  const multiP = useMemo(
    () => !platform || flatten([platform]).length > 1,
    [platform],
  );
  const isService = only_top === 1;

  const serviceFilterItem = useMemo(
    () =>
      ({
        label: isService
          ? intl.formatMessage({ id: 'cloudServices' })
          : intl.formatMessage({ id: 'assetClass' }),
        name: isService ? 'service_ids' : 'asset_type_ids',
        type: multiP ? 'cascader' : 'select',
        icon: isService ? 'icon-zhujimingcheng' : 'icon-shuxing_1',
        props: multiP
          ? {
              multiple: true,
              options: services,
            }
          : {
              mode: 'multiple',
              options: services,
            },
      }) as FilterFormParam,
    [multiP, services, isService],
  );

  return serviceFilterItem;
}

export default useServiceFilterItem;
