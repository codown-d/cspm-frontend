import { onRowClick } from '@/components/lib/ProComponents/TzProTable';
import TzFilter from '@/components/lib/TzFilter';
import useTzFilter, {
  FilterContext,
} from '@/components/lib/TzFilter/useTzFilter';
import TzFilterForm from '@/components/lib/TzFilterForm';
import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import useRegionFilterItem from '@/hooks/filterItems/useRegionFilterItem';
import useCredentials from '@/hooks/useCredentials';
import { useRegion } from '@/hooks/useRegion';
import useServiceTree from '@/hooks/useServiceTree';
import useTableAnchor from '@/hooks/useTableAnchor';
import { trans2PluginFilterData } from '@/pages/CloudPlatform/util';
import useSericeTypeFilterItem from '@/pages/components/ServiceCatalog/useSericeTypeFilterItem';
import { getAssets, getReportsAssetsById } from '@/services/cspm/Assets';
import { toDetailIntercept } from '@/utils';
import { ActionType } from '@ant-design/pro-components';
import { history, useIntl, useLocation, useModel } from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import { ItemType } from 'antd/lib/breadcrumb/Breadcrumb';
import classNames from 'classnames';
import { cloneDeep, keys, set } from 'lodash';
import {
  CSSProperties,
  ForwardedRef,
  ReactNode,
  forwardRef,
  memo,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import CustomList, { CustomListProps } from './CustomList';
import './index.less';

export type AssetListProps = Pick<CustomListProps, 'scope'> & {
  isFir?: boolean;
  boxH?: number;
  defaultParams?: {
    credential_id?: number;
    service_ids?: string[];
    task_id?: string;
  };
  className?: string;
  platform?: string | string[];
  extra?: boolean | ReactNode;
  infoBreadcrumb?: ItemType[];
  tableAnchorStyle?: CSSProperties;
};
export type AssetListRefFn = { getFilters: VoidFunction };
const AssetList = (
  {
    defaultParams,
    className,
    platform,
    isFir,
    infoBreadcrumb,
    extra,
    tableAnchorStyle,
    scope,
  }: AssetListProps,
  ref: ForwardedRef<AssetListRefFn>,
) => {
  const { task_id, service_ids } = defaultParams ?? {};
  const services = useServiceTree(platform);
  const actionRef = useRef<ActionType>();
  const [filters, setFilters] = useState<any>();
  const intl = useIntl();
  const credentials = useCredentials();
  const regions = useRegion(platform);
  const anchorRef = useRef<HTMLDivElement>(null);
  const listOffsetFn = useTableAnchor(anchorRef);
  const pathname = useLocation().pathname;
  const { commonConst } = useModel('global') ?? {};

  // useUpdateEffect(() => {
  //   actionRef.current?.reload();
  // }, [service_ids]);

  const assetTypeItem = useSericeTypeFilterItem({
    service_ids,
    platform,
    services,
  });
  const regionTypeItem = useRegionFilterItem({
    platform,
    regions,
  });

  const filterData = useMemo(
    () =>
      [
        {
          label: intl.formatMessage({ id: 'instanceId' }),
          name: 'instance_id',
          type: 'input',
          icon: 'icon-bianhao',
        },
        {
          label: intl.formatMessage({ id: 'name' }),
          name: 'instance_name',
          type: 'input',
          icon: 'icon-xingzhuangjiehe',
        },
        {
          label: intl.formatMessage({ id: 'cloudAccount' }),
          name: 'credential_ids',
          type: 'select',
          icon: 'icon-yonghujiaose',
          props: {
            mode: 'multiple',
            options: credentials,
          },
        },
        assetTypeItem,
        {
          label: intl.formatMessage({ id: 'securityRisk' }),
          name: 'risk_types',
          type: 'select',
          icon: 'icon-mingmingkongjian',
          props: {
            mode: 'multiple',
            options: commonConst?.risk_type,
          },
        },
        regionTypeItem,
        // {
        //   label: intl.formatMessage({ id: 'region' }),
        //   name: 'region_ids',
        //   type: multiP ? 'cascader' : 'select',
        //   icon: 'icon-weizhi',
        //   props: multiP
        //     ? {
        //         multiple: true,
        //         options: regions,
        //       }
        //     : {
        //         mode: 'multiple',
        //         options: regions,
        //       },
        // },
        {
          label: intl.formatMessage({
            id: !!task_id ? 'createdAt' : 'lastSeen',
          }),
          name: 'updated_at',
          type: 'rangePickerCt',
          icon: 'icon-shijian',
          props: {
            showTime: true,
          },
        },
      ].filter(
        (v) => !defaultParams?.credential_id || v.name !== 'credential_ids',
      ) as FilterFormParam[],
    [credentials, assetTypeItem, regionTypeItem, defaultParams, commonConst],
  );

  const dataFilter = useTzFilter({ initial: filterData });

  useUpdateEffect(() => {
    dataFilter.updateFilter(filterData);
  }, [regionTypeItem, assetTypeItem, credentials, commonConst]);
  const handleChange = useMemoizedFn((data: any) => {
    const temp = {};
    keys(data).forEach((key) => {
      let _val = cloneDeep(data[key]);
      if (key === 'updated_at' && _val) {
        _val[0] && set(temp, ['start_at'], +_val[0]);
        _val[1] && set(temp, ['end_at'], +_val[1]);
        return;
      }
      if (key === 'region_ids' && _val && regionTypeItem?.type !== 'select') {
        set(temp, [key], trans2PluginFilterData(_val, regions));
        return;
      }
      if (
        key === 'asset_type_ids' &&
        _val &&
        assetTypeItem?.type !== 'select'
      ) {
        set(temp, [key], trans2PluginFilterData(_val, services));
        return;
      }
      set(temp, [key], _val);
    });
    setFilters(temp);
  });

  useImperativeHandle(ref, () => {
    return {
      getFilters() {
        return { ...defaultParams, ...filters };
      },
    };
  });

  return (
    <div
      className={classNames('relative', className)}
      // style={boxH ? { minHeight: boxH + 20 } : {}}
    >
      <div
        className="absolute -top-[72px]"
        style={tableAnchorStyle}
        ref={anchorRef}
      />
      <FilterContext.Provider value={{ ...dataFilter }}>
        <div className="flex justify-between items-center">
          {extra ? extra : <div />}
          <TzFilter />
        </div>
        <TzFilterForm
          className={classNames({ fir: isFir })}
          onChange={handleChange}
        />
      </FilterContext.Provider>
      <CustomList
        platform={platform}
        actionRef={actionRef}
        params={{ ...filters, ...defaultParams }}
        onRow={(record) => {
          return {
            onClick: () =>
              onRowClick(() => {
                const _jump = () => {
                  history.push(`/asset/info/${record.hash_id}`, {
                    task_id,
                    infoBreadcrumb,
                  });
                };
                // 任务详情页不判断
                if (pathname?.includes('/task')) {
                  _jump();
                } else {
                  toDetailIntercept(
                    { type: 'asset', id: record.hash_id },
                    _jump,
                  );
                }
              }),
          };
        }}
        defaultParams={defaultParams}
        isHistory={!!defaultParams?.task_id}
        scope={scope}
        onChange={listOffsetFn}
        request={async (dp) => {
          const apiUrl = !!task_id ? getReportsAssetsById : getAssets;
          const { items, total } = await apiUrl({
            ...dp,
            ...defaultParams,
            ...(filters || {}),
          });
          return { data: items || [], total };
        }}
      />
    </div>
  );
};

export default memo(forwardRef(AssetList));
