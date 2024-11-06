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
import TzTypography from '@/components/lib/TzTypography';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import useTableAnchor from '@/hooks/useTableAnchor';
import { renderCommonStatusTag } from '@/pages/components/RenderRiskTag';
import { RenderTipByOverlay } from '@/pages/components/RenderTipByOverlay';
import { getVulnRisks } from '@/services/cspm/CloudPlatform';
import { ActionType } from '@ant-design/pro-components';
import { history, useIntl, useModel } from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import {
  ForwardedRef,
  forwardRef,
  memo,
  useMemo,
  useRef,
  useState,
} from 'react';
import VulnRiskDrawer from '../Info/Vuln/VulnRiskDrawer';
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

type TVulnRiskList = RiskListItemProps & {
  inDetail?: boolean;
};
export type VulnRiskListRefFn = { getFilters: VoidFunction };
function VulnRiskList(
  props: TVulnRiskList,
  ref: ForwardedRef<VulnRiskListRefFn>,
) {
  const {
    // platform,
    inDetail,
    className,
    tableAnchorStyle,
    filterToRef,
    isScanRes,
    infoBreadcrumb,
    refreshAction,
    // filterContainerRef,
    defaultParams,
    isFir,
    setFilters: setFiltersProps, //授控
    fetchParams: fetchParamsProps, // 授控，优先级最高
  } = props;
  const { severityOption, getSeverityTagInfoByStatus: getTagInfoByStatus } =
    useSeverityEnum();
  const [recordInfo, setRecordInfo] = useState<API.VulnRisksDatum>();

  const [filters, setFilters] = useState<any>();
  const fetchParams = useMemo(
    () => fetchParamsProps ?? filters,
    [fetchParamsProps, filters],
  );

  const intl = useIntl();
  const anchorRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<ActionType>();
  const listOffsetFn = useTableAnchor(anchorRef);
  const { commonConst } = useModel('global') ?? {};
  const task_id = fetchParams?.task_id || defaultParams?.task_id;
  const columns: TzProColumns<API.VulnRisksDatum>[] = useMemo(
    () =>
      [
        {
          title: intl.formatMessage({ id: 'vulnNo' }),
          dataIndex: 'name',
          render(_: string, entity: API.VulnRisksDatum) {
            const { name, description } = entity;
            if (!name) {
              return '-';
            }
            if (isScanRes) {
              return (
                <TzTypography.Paragraph ellipsis={{ tooltip: name, rows: 2 }}>
                  {name}
                </TzTypography.Paragraph>
              );
            }
            return <RenderTipByOverlay txt={name} description={description} />;
          },
        },
        {
          title: intl.formatMessage({ id: 'vulnDescription' }),
          dataIndex: 'description',
          tzEllipsis: 2,
        },
        {
          title: intl.formatMessage({ id: 'attackPath' }),
          dataIndex: 'attack_path_name',
          width: '23%',
          tzEllipsis: 2,
        },
        {
          title: intl.formatMessage({ id: 'affectedAssets' }),
          dataIndex: 'assets_count',
          width: '23%',
        },
        {
          title: intl.formatMessage({ id: 'severity' }),
          dataIndex: 'severity',
          align: 'center',
          width: '23%',
          // render: renderSeverityTag,
          render: (status: string) =>
            renderCommonStatusTag(
              {
                getTagInfoByStatus,
                status,
              },
              { size: 'small' },
            ),
        },
      ].filter((v) =>
        isScanRes
          ? v.dataIndex !== 'assets_count'
          : v.dataIndex !== 'description',
      ) as TzProColumns<API.VulnRisksDatum>[],
    [isScanRes],
  );

  const filterData: FilterFormParam[] = useMemo(
    () =>
      [
        {
          label: intl.formatMessage({ id: 'vulnNo' }),
          name: 'name',
          type: 'input',
          icon: 'icon-bianhao',
        },
        {
          label: intl.formatMessage({ id: 'vulnDescription' }),
          name: 'description',
          type: 'input',
          icon: 'icon-loudong',
        },
        {
          label: intl.formatMessage({ id: 'severityLevel' }),
          name: 'severity',
          type: 'select',
          icon: 'icon-chengdu',
          props: {
            mode: 'multiple',
            options: severityOption,
          },
        },
        {
          label: intl.formatMessage({ id: 'attackPath' }),
          name: 'attack_path',
          type: 'select',
          icon: 'icon-lujing',
          props: {
            mode: 'multiple',
            options: commonConst?.attack_path,
          },
        },
      ].filter(
        (v) => isScanRes || v.name !== 'description',
      ) as FilterFormParam[],
    [commonConst],
  );

  const data = useTzFilter({ initial: filterData });

  useUpdateEffect(() => {
    data.updateFilter({ formItems: filterData });
  }, [JSON.stringify(commonConst)]);

  const handleChange = useMemoizedFn(setFiltersProps ?? setFilters);

  return (
    <div className={classNames('relative', className)}>
      <div
        className="absolute -top-[74px]"
        style={tableAnchorStyle}
        ref={anchorRef}
      />
      <FilterContext.Provider value={{ ...data }}>
        <div className="flex gap-x-[6px] mb-2">
          <TzFilter />
          <TzFilterForm
            className="align-center-input"
            onChange={handleChange}
          />
        </div>
      </FilterContext.Provider>
      <TzProTable<API.VulnRisksDatum>
        rowKey="unique_id"
        onChange={listOffsetFn}
        onRow={(record) => {
          return {
            onClick: () =>
              onRowClick(() => {
                if (inDetail) {
                  setRecordInfo(record);
                } else {
                  history.push(`/risks/vuln-info/${record.unique_id}`, {
                    infoBreadcrumb,
                    task_id,
                  });
                }
              }),
          };
        }}
        actionRef={actionRef}
        params={{ ...defaultParams, ...fetchParams, refreshAction }}
        request={async (dp) => {
          const { total, items } = await getVulnRisks({
            ...dp,
            ...defaultParams,
            ...fetchParams,
          });
          return { total, data: items || [] };
        }}
        columns={columns}
      />
      <VulnRiskDrawer
        onClose={() => setRecordInfo(undefined)}
        dataSource={recordInfo}
        open={!!recordInfo}
        record={recordInfo}
      />
    </div>
  );
}

export default memo(forwardRef(VulnRiskList));
