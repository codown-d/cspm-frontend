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
import { getSensitiveRisks } from '@/services/cspm/CloudPlatform';
import { ActionType } from '@ant-design/pro-components';
import { history, useIntl, useModel } from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import { memo, useMemo, useRef, useState } from 'react';
import { TScanResList } from './interface';

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

function SensitiveRiskList(
  props: TScanResList & {
    inDetail?: boolean;
  },
) {
  const {
    infoBreadcrumb,
    className,
    tableAnchorStyle,
    filterToRef,
    defaultParams,
    inDetail,
  } = props;

  const [filters, setFilters] = useState<any>();
  const intl = useIntl();
  const listRef = useRef(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<ActionType>();
  const listOffsetFn = useTableAnchor(anchorRef);
  const ruleSensitiveRisks = useRuleSensitiveRisks();
  const { commonConst } = useModel('global') ?? {};
  const { riskSeverityOption, getSeverityTagInfoByStatus: getTagInfoByStatus } =
    useSeverityEnum();

  const columns: TzProColumns<API.SensitiveRisksDatum>[] = useMemo(
    () => [
      {
        title: intl.formatMessage({ id: 'sensitiveInformationRule' }),
        dataIndex: 'rule_title',
        tzEllipsis: 2,
      },
      {
        title: intl.formatMessage({ id: 'informationType' }),
        dataIndex: 'rule_category',
        tzEllipse: 2,
        width: '30%',
      },
      {
        title: intl.formatMessage({ id: 'filePath' }),
        dataIndex: 'filename',
        tzEllipse: 2,
        width: '30%',
      },
      {
        title: intl.formatMessage({ id: 'fileExt' }),
        dataIndex: 'ext',
        tzEllipse: 2,
      },
      {
        title: intl.formatMessage({ id: 'severityLevel' }),
        dataIndex: 'severity',
        align: 'center',
        width: 110,
        // render: (txt) => renderSeverityTag(txt),
        render: (status) =>
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
        name: 'rule_title',
        type: 'input',
        icon: 'icon-xingzhuangjiehe',
      },
      {
        label: intl.formatMessage({ id: 'filePath' }),
        name: 'filename',
        type: 'input',
        icon: 'icon-minganwenjian1',
      },
      {
        label: intl.formatMessage({ id: 'informationType' }),
        name: 'rule_category',
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
    ],
    [ruleSensitiveRisks, commonConst],
  );
  const dataFilter = useTzFilter({ initial: filterData });

  useUpdateEffect(() => {
    dataFilter.updateFilter({ formItems: filterData });
  }, [ruleSensitiveRisks, commonConst]);

  const handleChange = useMemoizedFn(setFilters);

  return (
    <div className={classNames('relative', className)} ref={listRef}>
      <div
        className="absolute -top-[74px]"
        style={tableAnchorStyle}
        ref={anchorRef}
      />
      <FilterContext.Provider value={{ ...dataFilter }}>
        <div className="flex gap-x-[6px] mb-2">
          <TzFilter />
          <TzFilterForm
            className="align-center-input"
            onChange={handleChange}
          />
        </div>
      </FilterContext.Provider>
      <TzProTable<API.SensitiveRisksDatum>
        onChange={listOffsetFn}
        rowKey="unique_id"
        className={classNames({ 'no-hover-table': inDetail })}
        onRow={
          inDetail
            ? undefined
            : (record) => {
                return {
                  onClick: () =>
                    onRowClick(() =>
                      history.push(
                        `/risks/sensitive-info/${record.rule_unique_id}`,
                        {
                          task_id: defaultParams.task_id,
                          infoBreadcrumb,
                        },
                      ),
                    ),
                };
              }
        }
        actionRef={actionRef}
        params={filters}
        request={async (dp) => {
          const { total, items } = await getSensitiveRisks({
            ...dp,
            ...defaultParams,
            ...(filters || {}),
          });
          return { total, data: items || [] };
        }}
        columns={columns}
      />
    </div>
  );
}

export default memo(SensitiveRiskList);
