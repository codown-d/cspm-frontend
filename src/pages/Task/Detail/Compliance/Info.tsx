import Range from '@/components/Range';
import TzProDescriptions from '@/components/lib/ProComponents/TzProDescriptions';
import { TzCard } from '@/components/lib/tz-card';
import { useIntl } from '@umijs/max';
import { ItemType } from 'antd/lib/breadcrumb/Breadcrumb';
import { isEmpty } from 'lodash';

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
            title: intl.formatMessage({ id: 'complianceFramework' }),
            key: 'compliance_names',
            dataIndex: 'compliance_names',
          },
          {
            title: intl.formatMessage({ id: 'scanRange' }),
            key: 'scope',
            dataIndex: 'scope',
            render: (_, record) => {
              const { scope } = record;
              if (isEmpty(scope)) {
                return '-';
              }
              return <Range conf={scope} />;
            },
          },
          {
            title: intl.formatMessage({ id: 'creator' }),
            key: 'creator',
            dataIndex: 'creator',
          },
        ]}
      />
    </TzCard>
  );
}

export default Info;
