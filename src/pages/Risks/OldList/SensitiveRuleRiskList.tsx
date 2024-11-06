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
import useRuleSensitiveRisks from '@/hooks/useRuleSensitiveRisks';
import useTableAnchor from '@/hooks/useTableAnchor';
import { renderCommonStatusTag } from '@/pages/components/RenderRiskTag';
import { getRuleSensitiveRisks } from '@/services/cspm/CloudPlatform';
import { ActionType } from '@ant-design/pro-components';
import { history, useIntl } from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import { memo, useMemo, useRef, useState } from 'react';
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

type TSensitiveRuleRiskList = RiskListItemProps & {};
function SensitiveRuleRiskList(props: TSensitiveRuleRiskList) {
  const {
    className,
    tableAnchorStyle,
    refreshAction,
    infoBreadcrumb,
    isFir,
    setFilters: setFiltersProps, //授控
    fetchParams: fetchParamsProps, // 授控，优先级最高
  } = props;

  const [filters, setFilters] = useState<any>();
  const fetchParams = fetchParamsProps ?? filters;
  const intl = useIntl();
  const listRef = useRef(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<ActionType>();
  const listOffsetFn = useTableAnchor(anchorRef);
  const ruleSensitiveRisks = useRuleSensitiveRisks();
  const { riskSeverityOption, getSeverityTagInfoByStatus: getTagInfoByStatus } =
    useSeverityEnum();
  const { task_id } = fetchParams ?? {};

  const columns: TzProColumns<API.RuleSensitiveRisksDatum>[] = useMemo(
    () => [
      {
        title: intl.formatMessage({ id: 'sensitiveInformationRule' }),
        dataIndex: 'title',
        tzEllipsis: 2,
      },
      {
        title: intl.formatMessage({ id: 'informationType' }),
        dataIndex: 'category',
        tzEllipse: 2,
        width: '23%',
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
        // render: (txt) => renderSeverityTag(txt),
        render: (status: string) =>
          renderCommonStatusTag(
            {
              getTagInfoByStatus,
              status,
            },
            { size: 'small' },
          ),
      },
    ],
    [],
  );

  const filterData: FilterFormParam[] = useMemo(
    () => [
      {
        label: intl.formatMessage({ id: 'sensitiveInformationRule' }),
        name: 'title',
        type: 'input',
        icon: 'icon-xingzhuangjiehe',
      },
      {
        label: intl.formatMessage({ id: 'severityLevel' }),
        name: 'severity',
        type: 'select',
        icon: 'icon-chengdu',
        props: {
          mode: 'multiple',
          options: riskSeverityOption,
        },
      },
      {
        label: intl.formatMessage({ id: 'informationType' }),
        name: 'category',
        type: 'select',
        icon: 'icon-leixing',
        props: {
          mode: 'multiple',
          options: ruleSensitiveRisks?.map((v) => ({
            label: v.category,
            value: v.category,
          })),
        },
      },
    ],
    [ruleSensitiveRisks],
  );
  const dataFilter = useTzFilter({ initial: filterData });

  useUpdateEffect(() => {
    dataFilter.updateFilter({ formItems: filterData });
  }, [JSON.stringify(ruleSensitiveRisks)]);

  const handleChange = useMemoizedFn(setFiltersProps ?? setFilters);

  return (
    <div className={classNames('relative', className)} ref={listRef}>
      <div
        className="absolute -top-[74px]"
        style={tableAnchorStyle}
        ref={anchorRef}
      />
      <FilterContext.Provider value={{ ...dataFilter }}>
        <TzFilter />
        <TzFilterForm
          className={classNames({ fir: isFir })}
          onChange={handleChange}
        />
      </FilterContext.Provider>
      <TzProTable<API.RuleSensitiveRisksDatum>
        onChange={listOffsetFn}
        onRow={(record) => {
          return {
            onClick: () =>
              onRowClick(() =>
                history.push(`/risks/sensitive-info/${record.unique_id}`, {
                  infoBreadcrumb,
                  task_id,
                }),
              ),
          };
        }}
        actionRef={actionRef}
        params={{ ...fetchParams, refreshAction }}
        request={async (dp) => {
          const { total, items } = await getRuleSensitiveRisks({
            ...dp,
            ...fetchParams,
          });
          return { total, data: items || [] };
        }}
        columns={columns}
      />
    </div>
  );
}

export default memo(SensitiveRuleRiskList);
