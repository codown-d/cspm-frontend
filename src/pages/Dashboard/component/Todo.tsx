import { TzButton } from '@/components/lib/tz-button';
import NoData from '@/components/NoData';
import TaskList, { ITaskList } from '@/components/TaskList';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import Loading from '@/loading';
import { geVulnerabilityList } from '@/services/cspm/Vulnerability';
import { history, useIntl, useNavigate } from '@umijs/max';
import { useEffect, useState } from 'react';

function MyTask() {
  const intl = useIntl();
  const [dataSource, setDataSource] = useState<ITaskList['list']>();
  const [loading, setLoading] = useState<boolean>(true);
  const { getSeverityTagInfoByStatus: getTagInfoByStatus } = useSeverityEnum();

  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    geVulnerabilityList({ page: 1, size: 10, status: 0 })
      .then((res) => {
        setDataSource(
          res.items?.map(({ id, created_at, name, severity }) => ({
            name,
            status: severity as string,
            time: created_at,
            id,
          })),
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-2">
        <div className="head-tit-1">
          {intl.formatMessage({ id: 'backlog' })}
        </div>
        <TzButton
          size="small"
          type="text"
          onClick={() => navigate('/vulnerability/list')}
        >
          {intl.formatMessage({ id: 'showMore' })}
        </TzButton>
      </div>
      <div>
        {loading ? (
          <Loading />
        ) : dataSource?.length ? (
          <TaskList
            onRow={(record) => {
              const { id } = record;
              history.push(`/vulnerability/detail/${id}`);
            }}
            list={dataSource}
            tagParams={{
              getTagInfoByStatus,
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
