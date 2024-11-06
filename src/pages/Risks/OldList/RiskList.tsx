import TzProTable, {
  TzProColumns,
  onRowClick,
} from '@/components/lib/ProComponents/TzProTable';
import {
  SingleValueType,
  TreeNode,
  TzCascaderProps,
  ValueType,
} from '@/components/lib/TzCascader/interface';
import TzFilter from '@/components/lib/TzFilter';
import useTzFilter, {
  FilterContext,
} from '@/components/lib/TzFilter/useTzFilter';
import TzFilterForm from '@/components/lib/TzFilterForm';
import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import useServiceTree from '@/hooks/useServiceTree';
import useTableAnchor from '@/hooks/useTableAnchor';
import { trans2PluginFilterData } from '@/pages/CloudPlatform/util';
import RenderColWithIcon from '@/pages/components/RenderColWithPlatformIcon';
import { renderCommonStatusTag } from '@/pages/components/RenderRiskTag';
import { RenderTipByOverlay } from '@/pages/components/RenderTipByOverlay';
import useSericeTypeFilterItem from '@/pages/components/ServiceCatalog/useSericeTypeFilterItem';
import { getReportRisksById, getRisks } from '@/services/cspm/CloudPlatform';
import { toDetailIntercept } from '@/utils';
import { ActionType } from '@ant-design/pro-components';
import { history, useIntl, useLocation } from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import { cloneDeep, keys, set } from 'lodash';
import {
  ForwardedRef,
  ReactNode,
  forwardRef,
  memo,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { RiskListItemProps } from './interface';

export const getCascaderLabels = (
  options: TreeNode[],
  values: SingleValueType[],
) => {
  function val2Label(
    val: ValueType,
    opt: TzCascaderProps['options'],
  ): TreeNode | undefined {
    return (val && opt?.length ? opt.find((v) => v.value === val) : val) as
      | TreeNode
      | undefined;
  }
  return values
    ?.map((vals: SingleValueType) => {
      const st1 = val2Label(vals[0], options);
      const st2 = val2Label(vals[1], st1?.children);
      return [st1?.label, st2?.label].filter((v) => !!v).join(' / ');
    })
    .filter((v) => !!v)
    .join(' , ');
};

type TRiskList = RiskListItemProps & {
  extra?: ReactNode;
};
export type RiskListRefFn = { resetFilterForm: VoidFunction };
function RiskList(props: TRiskList, ref: ForwardedRef<RiskListRefFn>) {
  const {
    platform,
    infoBreadcrumb,
    className,
    // initServiceFilter,
    tableAnchorStyle,
    // filterContainerRef,
    refreshAction,
    extra,
    filterToRef,
    isFir,
    setFilters: setFiltersProps, //授控
    fetchParams: fetchParamsProps, // 授控，优先级最高
  } = props;

  const [filters, setFilters] = useState<any>();
  const fetchParams = fetchParamsProps ?? filters;
  const { credential_id, task_id, service_ids, credential_ids } =
    fetchParamsProps ?? {};

  const intl = useIntl();
  const listRef = useRef(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<ActionType>();
  const listOffsetFn = useTableAnchor(anchorRef);
  const pathname = useLocation().pathname;
  const { riskSeverityOption, getSeverityTagInfoByStatus: getTagInfoByStatus } =
    useSeverityEnum();

  const services = useServiceTree(platform);

  const assetTypeItem = useSericeTypeFilterItem({
    service_ids,
    platform,
    services,
  });

  const columns: TzProColumns<API.RisksDatum>[] = useMemo(
    () => [
      {
        title: intl.formatMessage({ id: 'scanOptions' }),
        dataIndex: 'policy_title',
        render(_, entity) {
          const { policy_title, description } = entity;
          if (!policy_title) {
            return '-';
          }
          return (
            <RenderTipByOverlay txt={policy_title} description={description} />
          );
        },
      },
      {
        title: intl.formatMessage({ id: 'assetClass' }),
        dataIndex: 'asset_type_name',
        width: '23%',
        render(txt, entity) {
          return platform ? (
            txt
          ) : (
            <RenderColWithIcon
              platform={entity?.platform}
              name={`${entity?.asset_type_name}`}
            />
          );
        },
      },
      {
        title: intl.formatMessage({ id: 'affectedAssets' }),
        dataIndex: 'assets_count',
        width: '23%',
      },
      {
        title: intl.formatMessage({ id: 'severityLevel' }),
        dataIndex: 'severity',
        align: 'center',
        width: '23%',
        // render: renderSeverityTag,
        render: (_, { severity }) =>
          renderCommonStatusTag(
            {
              getTagInfoByStatus,
              status: severity,
            },
            { size: 'small' },
          ),
      },
    ],
    [platform],
  );

  const filterData = useMemo(
    () =>
      [
        {
          label: intl.formatMessage({ id: 'scanOptions' }),
          name: 'policy_title',
          type: 'input',
          icon: 'icon-jiance',
        },
        {
          label: intl.formatMessage({ id: 'severityLevel' }),
          name: 'severity',
          type: 'select',
          icon: 'icon-chengdu',
          props: {
            mode: 'multiple',
            // options: RISK_OPT,
            options: riskSeverityOption,
          },
        },
        assetTypeItem,
      ] as FilterFormParam[],
    [assetTypeItem],
  );
  const data = useTzFilter({ initial: filterData });

  const handleChange = useMemoizedFn((data: any) => {
    const temp = {};
    keys(data).forEach((key) => {
      let _val = cloneDeep(data[key]);
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
    (setFiltersProps ?? setFilters)(temp);
  });
  useImperativeHandle(ref, () => ({
    resetFilterForm() {
      data.updateFilter({ formItems: [...filterData], formValues: undefined });
    },
  }));
  useUpdateEffect(() => {
    data.updateFilter(filterData);
  }, [assetTypeItem, service_ids]);

  return (
    <div className={classNames('relative', className)} ref={listRef}>
      <div
        className="absolute -top-[74px]"
        style={tableAnchorStyle}
        ref={anchorRef}
      />
      <FilterContext.Provider value={{ ...data }}>
        {extra}
        {filterToRef?.current ? (
          createPortal(<TzFilter />, filterToRef.current)
        ) : (
          <TzFilter />
        )}
        <TzFilterForm
          className={classNames({ fir: isFir })}
          onChange={handleChange}
        />
      </FilterContext.Provider>
      <TzProTable<API.RisksDatum>
        rowKey="policy_id"
        onChange={listOffsetFn}
        onRow={(record) => {
          return {
            onClick: () =>
              onRowClick(() => {
                const _jump = () => {
                  history.push(`/risks/info/${record.policy_id}`, {
                    credential_ids: credential_id
                      ? [+credential_id]
                      : credential_ids,
                    task_id,
                    infoBreadcrumb,
                  });
                };
                if (pathname?.includes('/task')) {
                  _jump();
                } else {
                  toDetailIntercept(
                    { type: 'policy', id: record.policy_id },
                    _jump,
                  );
                }
              }),
          };
        }}
        actionRef={actionRef}
        params={{ ...fetchParams, refreshAction }}
        request={async (dp) => {
          const apiUrl = !!task_id ? getReportRisksById : getRisks;
          const { total, items } = await apiUrl({
            ...dp,
            task_id,
            service_ids,
            ...fetchParams,
          });
          return { total, data: items || [] };
        }}
        columns={columns}
      />
    </div>
  );
}

export default memo(forwardRef(RiskList));
