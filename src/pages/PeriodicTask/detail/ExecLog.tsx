import TzProTable, {
  TzProColumns,
  onRowClick,
} from '@/components/lib/ProComponents/TzProTable';
import { TzButton } from '@/components/lib/tz-button';
import { useTaskEnum } from '@/hooks/enum/useTaskEnum';
import useTableAnchor from '@/hooks/useTableAnchor';
import { renderCommonStatusTag } from '@/pages/components/RenderRiskTag';
import { getTaskList, taskRetry } from '@/services/cspm/Task';
import { history } from '@@/core/history';
import { ActionType } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { message } from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import Export from './Export';

const ExecLog: React.FC<{
  id: number;
  filterValue: any;
  type: API_TASK.ITaskType;
}> = (props) => {
  const { id, filterValue, type: taskType } = props;
  const actionRef = useRef<ActionType>();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [exportOpent, setExportOpent] = useState(false);
  const listOffsetFn = useTableAnchor(anchorRef);
  const intl = useIntl();
  const translate = useMemoizedFn((id, val?: any) =>
    intl.formatMessage({ id }, val),
  );
  const { getTaskTagInfoByStatus } = useTaskEnum();

  const oprFn = useMemoizedFn((btnType: 'reTry' | 'download', record) => {
    if (btnType === 'reTry') {
      taskRetry({
        task_id: record.id,
        type: taskType,
      }).then((res) => {
        if (!res?.error) {
          const _msg = translate('oprSuc', {
            name: translate(`action.${btnType}`),
          });
          message.success(_msg);
          actionRef.current?.reload();
        }
      });
      return;
    }
  });
  const columns: TzProColumns<API_TASK.TaskListResponse>[] = [
    {
      title: translate('taskCreationTime'),
      dataIndex: 'created_at',
      width: 200,
      sorter: true,
      valueType: 'dateTime',
    },
    {
      title: translate('status'),
      dataIndex: 'status',
      width: '10%',
      align: 'center',
      // render: (_: unknown, record: API.TaskListResponse) =>
      //   renderTaskStatusTag(record.status as any, taskType),

      render: (status) =>
        // renderCommonStatusTag({
        //   // getTagInfoByStatus: getTaskTagInfoByStatus(
        //   //   taskType === 'risks_scan' ? 'risk' : 'asset',
        //   // ),
        //   // status,
        // }),

        renderCommonStatusTag(
          {
            getTagInfoByStatus: getTaskTagInfoByStatus,
            status,
            scope: taskType,
          },
          { size: 'small' },
        ),
    },
    {
      title: translate('errorReason'),
      dataIndex: 'fail_reason',
      tzEllipsis: 2,
    },
    {
      title: translate('operate'),
      dataIndex: 'option',
      width: '8%',
      render: (_, record) => {
        const _status: string = record.status;
        if (['finished', 'failed'].includes(_status)) {
          if (_status === 'finished') {
            return (
              <Export
                task_id={record.id}
                file_name={translate('assetScanTaskReport')}
                onToggle={setExportOpent}
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
  ];

  const requestFn = useMemoizedFn(async ({ date, ...filter }, sorter) => {
    let [start_at, end_at] = date
      ? date.map((v: typeof dayjs) => (v ? v.valueOf() : undefined))
      : [undefined, undefined];
    const { total, items } = await getTaskList({
      ...filter,
      ...sorter,
      path: taskType,
      schedule_id: id,
      start_at,
      end_at,
    });
    return { total, data: items || [] };
  });

  return (
    <>
      <div className="absolute top-0" ref={anchorRef} />
      <TzProTable<any>
        rowKey={'created_at'}
        onChange={listOffsetFn}
        className="mt-2"
        actionRef={actionRef}
        params={filterValue}
        request={requestFn}
        columns={columns}
        onRow={(record) => {
          return {
            onClick: () => {
              if (exportOpent) return;
              onRowClick(() => history.push(`/task/asset/detail/${record.id}`));
            },
          };
        }}
      />
    </>
  );
};

export default ExecLog;
