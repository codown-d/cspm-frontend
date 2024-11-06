import Range from '@/components/Range';
import TzProTable, {
  TzProColumns,
  onRowClick,
} from '@/components/lib/ProComponents/TzProTable';
import TzFilter from '@/components/lib/TzFilter';
import { FilterContext } from '@/components/lib/TzFilter/useTzFilter';
import TzFilterForm from '@/components/lib/TzFilterForm';
import { TzButton } from '@/components/lib/tz-button';
import useTableAnchor from '@/hooks/useTableAnchor';
import { renderCommonStatusTag } from '@/pages/components/RenderRiskTag';
import { getExportList, getTaskList } from '@/services/cspm/Task';
import { history } from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import { get, isEmpty, keys } from 'lodash';
import React, { useMemo, useRef, useState } from 'react';
import Export from './Export';
import { ExportFileMap, useList } from './useList';

// const PathMap: Record<API.ITaskScopeType, API.TaskListRequest['path']> = {
//   assets_scan: 'assets_scan',
//   risk: 'risks_scan',
//   export: 'reports_export',
// };

interface IProps {
  tab: API_TASK.ITaskScopeType;
  count?: number;
}

const PATH_MAP = {
  assets_scan: 'asset',
  compliance_scan: 'compliance',
};
const Title = {
  assets_scan: 'assetScanTask',
  compliance_scan: 'complianceScanTask',
  reports_export: 'exportTask',
};

const TabContent: React.FC<IProps> = (props) => {
  const { tab, count } = props;
  const anchorRef = useRef<HTMLDivElement>(null);
  const listOffsetFn = useTableAnchor(anchorRef);
  const [exportOpent, setExportOpent] = useState<boolean>();
  const [filterVal, setFilterVal] = useState<any>({});
  const isExportTab = tab === 'reports_export';

  const {
    actionRef,
    optionals,
    dataFilter,
    oprFn,
    getTaskTagInfoByStatus,
    translate,
  } = useList(tab);

  const columns: TzProColumns<API_TASK.TaskListResponse>[] = useMemo(() => {
    const all = [
      {
        title: translate('taskCreationTime'),
        dataIndex: 'created_at',
        width: '18%',
        valueType: 'dateTime',
      },
      {
        title: translate('taskType'),
        dataIndex: 'type_name',
        isOptional: true,
      },
      {
        title: translate('complianceFramework'),
        dataIndex: 'compliance_names',
        isOptional: true,
        tzEllipsis: 2,
      },
      {
        title: translate('scanRange'),
        dataIndex: 'scope',
        isOptional: true,
        tzEllipsis: 2,
        width: '20%',
        render: (_, record) => {
          const { scope } = record;
          if (isEmpty(scope)) {
            return '-';
          }
          return <Range conf={scope} />;
        },
      },
      {
        title:
          get(optionals, ['content', 'label']) ?? translate('detectContent'),
        dataIndex: 'content',
        tzEllipsis: 2,
        isOptional: true,
      },
      {
        title: translate('creator'),
        dataIndex: 'creator',
        tzEllipsis: 2,
      },
      {
        // 等待中  生成中  已完成 已失败 pending running finished failed
        title: translate('status'),
        dataIndex: 'status',
        width: '12%',
        align: 'center',
        render: (status: API.ITaskType) =>
          renderCommonStatusTag(
            {
              getTagInfoByStatus: getTaskTagInfoByStatus,
              status,
              scope: tab,
            },
            { size: 'small' },
          ),
      },
      {
        title: translate('failureReason'),
        dataIndex: 'fail_reason',
        tzEllipsis: 2,
      },
      {
        title: translate('operate'),
        width: 80,
        dataIndex: 'option',
        render: (_: unknown, record: API.TaskListResponse) => {
          const _status: string = record.status;
          if (_status === 'finished') {
            if (!isExportTab) {
              return (
                <Export
                  onOpenChange={(open) => setExportOpent(open)}
                  task_id={record.id}
                  file_name={ExportFileMap[tab].name}
                  execute_type={ExportFileMap[tab].type}
                />
              );
            }
            return (
              <TzButton
                style={{ marginLeft: -8 }}
                size="small"
                type="text"
                onClick={(e) => {
                  e.stopPropagation();
                  oprFn('download', record);
                }}
              >
                {translate('download')}
              </TzButton>
            );
          }
          if (_status === 'failed') {
            return (
              <TzButton
                style={{ marginLeft: -8 }}
                size="small"
                type="text"
                onClick={(e) => {
                  e.stopPropagation();
                  oprFn('reTry', record);
                }}
              >
                {translate('reTry')}
              </TzButton>
            );
          }
          return '-';
        },
      },
    ].filter((v) => !v.isOptional || keys(optionals)?.includes(v.dataIndex));

    return all;
  }, [tab, optionals]);

  const requestFn = useMemoizedFn(async (dp) => {
    const fetchUrl = isExportTab ? getExportList : getTaskList;
    const res = await fetchUrl({
      path: tab,
      ...dp,
    });
    return {
      total: res.total,
      data: res.items || [],
    };
  });
  const isRiskOrAsset = ['compliance_scan', 'assets_scan'].includes(tab);

  useUpdateEffect(() => {
    actionRef.current?.reload();
  }, [count]);

  return (
    <div className="mt-[2px]">
      <FilterContext.Provider value={{ ...dataFilter }}>
        <div className="absolute top-0" ref={anchorRef} />
        <div className="flex justify-between items-center">
          <span className={'table-h1'}>{translate(Title[tab])}</span>
          <TzFilter />
        </div>
        <TzFilterForm className="fir" onChange={(v) => setFilterVal(v)} />
      </FilterContext.Provider>

      <TzProTable<API.TaskListResponse>
        onChange={listOffsetFn}
        className={classNames('mt-2', { 'no-hover-table': !isRiskOrAsset })}
        actionRef={actionRef}
        params={filterVal}
        request={requestFn}
        columns={columns}
        onRow={(record) => {
          return {
            onClick: () => {
              !exportOpent &&
                isRiskOrAsset &&
                onRowClick(() =>
                  history.push(
                    `/task/${get(PATH_MAP, tab)}/detail/${record.id}`,
                  ),
                );
            },
          };
        }}
      />
    </div>
  );
};

export default TabContent;
