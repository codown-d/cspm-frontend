import NoData from '@/components/NoData';
import TaskList, { ITaskList } from '@/components/TaskList';
import { TzButton } from '@/components/lib/tz-button';
import { useTaskEnum } from '@/hooks/enum/useTaskEnum';
import Loading from '@/loading';
import { getTasksFuture } from '@/services/cspm/Home';
import { history, useIntl, useNavigate } from '@umijs/max';
import { useEffect, useState } from 'react';
import { TasksFutureType } from '../MyTask';

function MyTask() {
  const intl = useIntl();
  const [dataSource, setDataSource] = useState<ITaskList['list']>();
  const [loading, setLoading] = useState<boolean>(true);
  const { getTaskTagInfoByStatus } = useTaskEnum();
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    getTasksFuture()
      .then((res) => {
        setDataSource(
          res.items?.map(
            ({ created_at, type_name, type, next_schedule_time, ...rest }) => ({
              ...rest,
              type,
              name: type_name,
              time:
                type === 'assets_scan_schedule'
                  ? next_schedule_time
                  : created_at,
              timeLabel:
                type === 'assets_scan_schedule'
                  ? intl.formatMessage({ id: 'nextExecutionPeriod' })
                  : undefined,
            }),
          ),
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-2">
        <div className="head-tit-1">{intl.formatMessage({ id: 'myTask' })}</div>
        <TzButton size="small" type="text" onClick={() => navigate('/task')}>
          {intl.formatMessage({ id: 'showMore' })}
        </TzButton>
      </div>
      <div>
        {loading ? (
          <Loading />
        ) : dataSource?.length ? (
          <TaskList
            onRow={(record) => {
              const { id, type } = record;
              const { AssetsScanSchedule, ComplianceScsnTask, AssetsScanTask } =
                TasksFutureType;

              if (type === AssetsScanSchedule) {
                history.push(`/asset/periodic-task/detail/${id}`);
                return;
              }
              if (type === AssetsScanTask) {
                history.push(`/task/asset/detail/${id}`);
                return;
              }
              if (type === ComplianceScsnTask) {
                history.push(`/task/compliance/detail/${id}`);
                return;
              }
              return;
            }}
            list={dataSource}
            tagParams={{
              getTagInfoByStatus: getTaskTagInfoByStatus,
            }}
            timeLabel={intl.formatMessage({ id: 'creationTime' })}
          />
        ) : (
          <NoData />
        )}
      </div>
    </div>
  );
}

export default MyTask;
