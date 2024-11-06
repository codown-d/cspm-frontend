import { TzProColumns } from '@/components/lib/ProComponents/TzProTable';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import { getTasksFuture } from '@/services/cspm/Home';
import { geVulnerabilityList } from '@/services/cspm/Vulnerability';
import { history, useIntl } from '@umijs/max';
import classNames from 'classnames';
import { memo, useEffect, useMemo, useState } from 'react';
import { renderCommonStatusTag } from '../components/RenderRiskTag';
import styles from './MyTask.less';
import TodoList from './components/TodoList';

function Todo() {
  const intl = useIntl();
  const [dataSource, setDataSource] = useState<API.VulnerabilityItem[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const { getSeverityTagInfoByStatus: getTagInfoByStatus } = useSeverityEnum();
  useEffect(() => {
    setLoading(true);
    geVulnerabilityList({ page: 1, size: 10, status: 0 })
      .then((res) => setDataSource(res.items))
      .finally(() => setLoading(false));
  }, []);
  const columns: TzProColumns<API.VulnerabilityItem>[] = useMemo(
    () => [
      {
        title: intl.formatMessage({ id: 'vulnerability' }),
        dataIndex: 'name',
        tzEllipsis: true,
      },
      {
        title: intl.formatMessage({ id: 'severity' }),
        dataIndex: 'severity',
        // render: renderSeverityTag,
        align: 'center',
        width: '20%',
        render: (status) =>
          renderCommonStatusTag(
            {
              getTagInfoByStatus,
              status,
            },
            { size: 'small' },
          ),
      },
      {
        title: intl.formatMessage({ id: 'creationTime' }),
        dataIndex: 'created_at',
        valueType: 'dateTime',
        width: '36%',
        tzEllipsis: true,
      },
    ],
    [],
  );
  return (
    <TodoList<API.VulnerabilityItem>
      columns={columns}
      dataSource={dataSource}
      fetchUrl={getTasksFuture}
      className={classNames(styles.Todo, {
        [styles.overCls]: (dataSource?.length ?? 0) > 4,
      })}
      loading={loading}
      goUrl="/vulnerability/list"
      onRow={({ id }) => {
        return {
          onClick: () => {
            history.push(`/vulnerability/detail/${id}`);
          },
        };
      }}
    />
  );
}

export default memo(Todo);
