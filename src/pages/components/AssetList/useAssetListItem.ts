import { getValueEnumByFilterOption, IPolicyTableOptionals } from '@/utils';
import { useIntl } from '@umijs/max';
import { get, isObject } from 'lodash';
import { useMemo } from 'react';
import { AssetTableProps } from './AssetTable';
import { IAssetTableFilterProps } from './interface';

type IProps = Pick<AssetTableProps, 'optionals'> & {
  platform?: string;
  filterItems?: Partial<IAssetTableFilterProps>;
};
const useAssetListItem = (params: IProps) => {
  const intl = useIntl();
  const { filterItems, platform, optionals } = params;
  const _optionals = useMemo(() => {
    const { serviceItem, credentialItem, riskTypesItem } = filterItems ?? {};
    const serviceValueEnum = getValueEnumByFilterOption(serviceItem, platform);
    const credentialValueEnum = getValueEnumByFilterOption(
      credentialItem,
      platform,
    );
    const riskTypesValueEnum = getValueEnumByFilterOption(riskTypesItem);
    const defaultOpt = [
      'instance_info',
      'region_ids',
      {
        name: 'risk_types',
        valueEnum: riskTypesValueEnum,
      },
      {
        name: 'updated_at',
        label: intl.formatMessage({ id: 'modifiedTime' }),
      },
      {
        name: 'service_ids',
        valueEnum: serviceValueEnum,
      },
      {
        name: 'credential_ids',
        valueEnum: credentialValueEnum,
      },
    ];
    const getName = (v: IPolicyTableOptionals) =>
      isObject(v) ? get(v, 'name') : v;
    if (optionals?.length) {
      return optionals.map((v) => {
        const name = getName(v);
        if (name === 'service_ids') {
          return {
            ...(isObject(v) ? v : {}),
            name: 'service_ids',
            valueEnum: serviceValueEnum,
          };
        }
        if (name === 'credential_ids') {
          return {
            ...(isObject(v) ? v : {}),
            name: 'credential_ids',
            valueEnum: credentialValueEnum,
          };
        }
        if (name === 'risk_types') {
          return {
            ...(isObject(v) ? v : {}),
            name: 'risk_types',
            valueEnum: riskTypesValueEnum,
          };
        }
        return v;
      });
    }
    return defaultOpt;
  }, [filterItems, optionals, platform]);

  return { optionals: _optionals };
};

export default useAssetListItem;
