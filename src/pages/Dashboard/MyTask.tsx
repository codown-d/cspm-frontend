import { TzProColumns } from '@/components/lib/ProComponents/TzProTable';
import { useTaskEnum } from '@/hooks/enum/useTaskEnum';
import { getTasksFuture } from '@/services/cspm/Home';
import { history, useIntl } from '@umijs/max';
import classNames from 'classnames';
import { memo, useEffect, useMemo, useState } from 'react';
import { renderCommonStatusTag } from '../components/RenderRiskTag';
import styles from './MyTask.less';
import TodoList from './components/TodoList';

export enum TasksFutureType {
  ReportsExport = 'reports_export',
  AssetsScanSchedule = 'assets_scan_schedule',
  ComplianceScsnTask = 'compliance_scan_task',
  AssetsScanTask = 'assets_scan_task',
}
function MyTask() {
  const intl = useIntl();
  const [dataSource, setDataSource] = useState<API.TasksFutureItem[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const { getTaskTagInfoByStatus } = useTaskEnum();
  useEffect(() => {
    setLoading(true);
    getTasksFuture()
      .then((res: any) => setDataSource(res.items))
      .finally(() => setLoading(false));
  }, []);
  const columns: TzProColumns<API.TasksFutureItem>[] = useMemo(
    () => [
      {
        title: intl.formatMessage({ id: 'taskCreationTime' }),
        dataIndex: 'created_at',
        valueType: 'dateTime',
        tzEllipsis: true,
        // width: '30%',
        width: '30%',
      },
      {
        title: intl.formatMessage({ id: 'taskType' }),
        dataIndex: 'type_name',
        tzEllipsis: true,
        width: '20%',
      },
      {
        title: intl.formatMessage({ id: 'status' }),
        dataIndex: 'status',
        align: 'center',
        width: '25%',
        render: (status, { type }) => {
          return type
            ? renderCommonStatusTag(
                {
                  getTagInfoByStatus: getTaskTagInfoByStatus,
                  status,
                  scope: type,
                },
                { size: 'small' },
              )
            : '-';
        },
        // render: (txt, record) =>
        //   renderTaskStatusTag(
        //     txt as API.TaskDetailBasicStatus,
        // record.type as API.ITaskType,
        //     false,
        //   ),
      },
      {
        title: intl.formatMessage({ id: 'nextExecutionPeriod' }),
        dataIndex: 'next_schedule_time',
        valueType: 'dateTime',
        tzEllipsis: true,
        width: '30%',
      },
    ],
    [],
  );

  return (
    <TodoList<API.TasksFutureItem>
      title={intl.formatMessage({ id: 'myTask' })}
      goUrl="/task"
      columns={columns}
      fetchUrl={getTasksFuture}
      dataSource={dataSource}
      loading={loading}
      className={classNames(styles.MyTask, {
        [styles.overCls]: (dataSource?.length ?? 0) > 4,
      })}
      rowClassName={(record: API.TasksFutureItem) =>
        record.type === TasksFutureType.ReportsExport ? styles.rowNoHover : ''
      }
      onRow={({ id, type }) => {
        return {
          onClick: () => {
            const {
              AssetsSyncSchedule,
              AssetsSyncTask,
              RisksScanSchedule,
              RisksScanTask,
            } = TasksFutureType;
            if (type === AssetsSyncSchedule) {
              history.push(`/asset/periodic-task/detail/${id}`);
              return;
            }
            if (type === RisksScanSchedule) {
              history.push(`/risks/list/periodic-task/detail/${id}`);
              return;
            }
            if (type === AssetsSyncTask) {
              history.push(`/task/asset/detail/${id}`);
              return;
            }
            if (type === RisksScanTask) {
              history.push(`/task/risk/detail/${id}`);
              return;
            }
            return;
          },
        };
      }}
    />
  );
}

export default memo(MyTask);
