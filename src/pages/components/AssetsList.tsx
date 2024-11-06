import {
  TzProTableProps,
  onRowClick,
} from '@/components/lib/ProComponents/TzProTable';
import TzFilter from '@/components/lib/TzFilter';
import useTzFilter, {
  FilterContext,
} from '@/components/lib/TzFilter/useTzFilter';
import TzFilterForm from '@/components/lib/TzFilterForm';
import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import { TzCard } from '@/components/lib/tz-card';
import useRegionFilterItem from '@/hooks/filterItems/useRegionFilterItem';
import useServiceFilterItem from '@/hooks/filterItems/useServiceFilterItem';
import useCredentials from '@/hooks/useCredentials';
import { useRegion } from '@/hooks/useRegion';
import useTableAnchor from '@/hooks/useTableAnchor';
import { getAssets } from '@/services/cspm/Assets';
import { toDetailIntercept } from '@/utils';
import { ActionType, ParamsType } from '@ant-design/pro-components';
import { history, useIntl } from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import { BreadcrumbProps } from 'antd';
import { cloneDeep, keys, set } from 'lodash';
import {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import CustomList, { CustomListProps } from '../Asset/OldList/CustomList';
import { trans2PluginFilterData } from '../CloudPlatform/util';

export type TAssetsListInnerProps<Q, R> = Pick<
  CustomListProps,
  'scope' | 'isHistory' | 'platform'
> & {
  infoBreadcrumb?: BreadcrumbProps['items'];
  cardId?: string;
  apiUrl?: (params: Q) => Promise<API.ResponseWithItems<R>>;
  defaultParams?: Partial<Q>;
  tableProps?: TzProTableProps<Record<string, any>, ParamsType, 'text'>;
};
declare module 'react' {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export type AssetsListRefFn = { getFilters: VoidFunction };
function AssetsListInner<Q, R>(
  props: TAssetsListInnerProps<Q, R>,
  ref?: ForwardedRef<AssetsListRefFn>,
) {
  const {
    platform,
    defaultParams,
    cardId,
    infoBreadcrumb,
    isHistory,
    scope,
    tableProps,
    apiUrl = getAssets,
  } = props;
  const actionRef = useRef<ActionType>();
  const filterRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<any>();
  const intl = useIntl();
  const regions = useRegion(platform);
  const anchorRef = useRef<HTMLDivElement>(null);
  const listOffsetFn = useTableAnchor(anchorRef);
  const credentials = useCredentials();
  const { task_id } = defaultParams ?? {};

  const serviceItem = useServiceFilterItem({
    platform,
    only_top: 1,
  });
  const regionTypeItem = useRegionFilterItem({
    platform,
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
          label: intl.formatMessage({ id: 'instanceName' }),
          name: 'instance_name',
          type: 'input',
          icon: 'icon-xingzhuangjiehe',
        },
        serviceItem,
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
        regionTypeItem,
        // {
        //   label: intl.formatMessage({ id: 'region' }),
        //   name: 'region_ids',
        //   type: !platform ? 'cascader' : 'select',
        //   icon: 'icon-weizhi',
        //   props: !platform
        //     ? {
        //         multiple: true,
        //         options: regions,
        //       }
        //     : {
        //         mode: 'multiple',
        //         options: regions,
        //       },
        // },
      ].filter(
        (v) => scope !== 'config' || v.name !== 'asset_type_ids',
      ) as FilterFormParam[],
    [regionTypeItem, services, serviceItem, credentials],
  );
  const dataFilter = useTzFilter({ initial: filterData });
  useUpdateEffect(() => {
    dataFilter.updateFilter({ formItems: filterData });
  }, [services, regionTypeItem, serviceItem, credentials]);
  const handleChange = useMemoizedFn((data: any) => {
    const temp = {};
    keys(data).forEach((key) => {
      let _val = cloneDeep(data[key]);
      if (key === 'created_at' && _val) {
        _val[0] && set(temp, ['start_at'], +_val[0]);
        _val[1] && set(temp, ['end_at'], +_val[1]);
        return;
      }

      if (key === 'asset_type_ids' && _val && serviceItem.type !== 'select') {
        set(temp, [key], trans2PluginFilterData(_val, services));
        return;
      }
      if (key === 'region_ids' && _val && regionTypeItem.type !== 'select') {
        set(temp, [key], trans2PluginFilterData(_val, regions));
        return;
      }
      set(temp, [key], _val);
    });
    setFilters(temp);
  });

  useImperativeHandle(ref, () => {
    return {
      getFilters() {
        return filters;
      },
    };
  });

  return (
    <TzCard
      id={cardId}
      headStyle={{ paddingBottom: 4 }}
      bodyStyle={{ paddingTop: 0 }}
      title={intl.formatMessage({ id: 'riskInstance' })}
      extra={<div ref={filterRef} />}
    >
      <div className="absolute -top-[88px]" ref={anchorRef} />
      <FilterContext.Provider value={{ ...dataFilter }}>
        {filterRef.current ? (
          createPortal(<TzFilter />, filterRef.current)
        ) : (
          <TzFilter />
        )}
        <TzFilterForm onChange={handleChange} />
      </FilterContext.Provider>
      <CustomList
        noDefaultW
        actionRef={actionRef}
        params={filters}
        scope={scope}
        platform={platform}
        isHistory={isHistory}
        onChange={listOffsetFn}
        onRow={(record) => {
          return {
            onClick: () =>
              onRowClick(() =>
                toDetailIntercept({ type: 'asset', id: record.hash_id }, () =>
                  history.push(`/asset/info/${record.hash_id}`, {
                    task_id,
                    infoBreadcrumb,
                  }),
                ),
              ),
          };
        }}
        request={async (dp) => {
          const { total, items } = await apiUrl({
            ...dp,
            ...defaultParams,
            ...(filters || {}),
          });

          return { total, data: items || [] };
        }}
        {...tableProps}
      />
    </TzCard>
  );
}

const AssetsListWithRef = forwardRef(AssetsListInner);

export type AssetsListProps<Q, R> = TAssetsListInnerProps<Q, R> & {
  mRef?: React.Ref<AssetsListRefFn>;
};

function AssetsList<Q = API_ASSETS.AssetsRequest, R = API_ASSETS.AssetsDatum>({
  mRef,
  ...props
}: AssetsListProps<Q, R>) {
  return <AssetsListWithRef ref={mRef} {...props} />;
}
export default AssetsList;
