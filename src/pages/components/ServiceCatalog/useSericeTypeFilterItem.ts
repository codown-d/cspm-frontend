import { useIntl } from '@umijs/max';
import { isString, isUndefined } from 'lodash';
import { useMemo } from 'react';

type SericeTypeFilterItemProps = {
  platform?: string | string[];
  service_ids?: string[];
  services?: (
    | API.CommonServicetreeResponse
    | API.CommonServicetreeResponseChild
  )[];
};

function useSericeTypeFilterItem({
  service_ids,
  platform,
  services,
}: SericeTypeFilterItemProps) {
  const platforms = isString(platform) ? [platform] : platform;
  const intl = useIntl();
  const assetTypeItem = useMemo(() => {
    const _item = {
      label: intl.formatMessage({ id: 'cloudServices' }),
      name: 'service_ids',
      type: 'cascader',
      icon: 'icon-zhujimingcheng',
      props: {
        multiple: true,
        options: services,
      },
    };
    if (isUndefined(platforms)) {
      return _item;
    }
    if (!service_ids?.length && !platforms?.length) {
      return {
        ..._item,
        type: 'select',
        props: {
          mode: 'multiple',
          options: [],
        },
      };
    }
    if ((platforms?.length ?? 0) < 2) {
      return {
        ..._item,
        type: 'select',
        props: {
          mode: 'multiple',
          options: (services as API.CommonServicetreeResponseChild[])?.filter(
            (v) => service_ids?.includes(v.top_service),
          ),
        },
      };
    }
    return {
      ..._item,
      props: {
        multiple: true,
        options: (services as API.CommonServicetreeResponse[])
          ?.filter((v) => platforms?.includes(v.id))
          .map((v) => ({
            ...v,
            children: v.children.filter(
              (v) =>
                !service_ids?.length || service_ids.includes(v.top_service),
            ),
          })),
      },
    };
  }, [service_ids, platforms, services]);

  return assetTypeItem;
}

export default useSericeTypeFilterItem;
