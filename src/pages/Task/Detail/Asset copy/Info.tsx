import Range from '@/components/Range';
import TzProDescriptions from '@/components/lib/ProComponents/TzProDescriptions';
import { TzCard } from '@/components/lib/tz-card';
import { useIntl } from '@umijs/max';
import { ItemType } from 'antd/lib/breadcrumb/Breadcrumb';

type InfoProps = {
  dataSource?: API.TaskDetailBasic;
  loading?: boolean;
  infoBreadcrumb?: ItemType[];
  cardId: string;
};
function Info({ infoBreadcrumb, cardId, ...restProps }: InfoProps) {
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
            title: intl.formatMessage({ id: 'syncMode' }),
            key: 'asset_config',
            className: 'btn-row',
            dataIndex: 'asset_config',
            render(_: unknown, record: API.TaskDetailBasic) {
              return <Range conf={record.asset_config} />;
            },
          },
        ]}
      />
    </TzCard>
  );
}

export default Info;
