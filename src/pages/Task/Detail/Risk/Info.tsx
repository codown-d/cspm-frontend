import Range from '@/components/Range';
import TzProDescriptions, {
  renderWithLinkEllipsis,
} from '@/components/lib/ProComponents/TzProDescriptions';
import { TzCard } from '@/components/lib/tz-card';
import { toDetailIntercept } from '@/utils';
import { history, useIntl } from '@umijs/max';
import { ItemType } from 'antd/lib/breadcrumb/Breadcrumb';

type InfoProps = {
  dataSource?: API.TaskDetailBasic;
  loading?: boolean;
  infoBreadcrumb?: ItemType[];
  cardId: string;
};
function Info({ infoBreadcrumb, cardId, dataSource, ...restProps }: InfoProps) {
  const intl = useIntl();

  return (
    <TzCard
      id={cardId}
      bodyStyle={
        restProps.loading
          ? { padding: '4px 16px 16px 16px' }
          : { paddingBlock: '4px 0' }
      }
      className="is-descriptions"
      title={intl.formatMessage({ id: 'basicInfo' })}
    >
      <TzProDescriptions
        dataSource={dataSource}
        {...restProps}
        columns={[
          {
            title: intl.formatMessage({ id: 'taskType' }),
            key: 'type_name',
            dataIndex: 'type_name',
          },
          {
            title: intl.formatMessage({ id: 'creator' }),
            key: 'creator',
            dataIndex: 'creator',
          },
          {
            title: intl.formatMessage({ id: 'detectContent' }),
            key: 'content',
            dataIndex: 'content',
          },
          {
            title: intl.formatMessage({
              id: 'cloudConfigurationDetectionBaseline',
            }),
            key: 'benchmark_name',
            dataIndex: 'benchmark_name',
            className: 'btn-row',
            render(_: unknown, record: API.TaskDetailBasic) {
              return renderWithLinkEllipsis(
                record.benchmark_name || '-',
                record,
                () =>
                  toDetailIntercept(
                    { type: 'benchmark', id: record.benchmark_id },
                    () =>
                      history.push(
                        `/risks/basic-line/info/${record.benchmark_id}`,
                      ),
                  ),
              );
            },
          },
          {
            // 配置检测范围
            title: intl.formatMessage({ id: 'configurationDetectionScope' }),
            key: 'config_config',
            dataIndex: 'config_config',
            className: 'btn-row',
            render(_: unknown, record: API.TaskDetailBasic) {
              return <Range conf={record.config_config} />;
            },
          },
          {
            // 无代理检测范围
            title: intl.formatMessage({ id: 'agentlessDetectionScope' }),
            key: 'agentless_config',
            dataIndex: 'agentless_config',
            className: 'btn-row',
            render(_: unknown, record: API.TaskDetailBasic) {
              return <Range conf={record.agentless_config} />;
            },
          },
        ].filter((item) => {
          if (dataSource?.scan_types?.length === 2) {
            return true;
          }
          if (dataSource?.scan_types?.includes('config')) {
            return item.dataIndex !== 'agentless_config';
          } else if (dataSource?.scan_types?.includes('agentless')) {
            return !['config_config', 'benchmark_name'].includes(
              item.dataIndex,
            );
          } else {
            return ![
              'config_config',
              'benchmark_name',
              'agentless_config',
            ].includes(item.dataIndex);
          }
        })}
      />
    </TzCard>
  );
}

export default Info;
