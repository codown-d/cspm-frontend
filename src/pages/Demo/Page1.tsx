import TzProTable, {
  TzProColumns,
} from '@/components/lib/ProComponents/TzProTable';
import { getRisks } from '@/services/cspm/CloudPlatform';
import { history, useIntl } from '@umijs/max';
import React from 'react';

const Page1: React.FC = () => {
  const intl = useIntl();
  const columns: TzProColumns<API.RisksDatum>[] = [
    {
      title: intl.formatMessage({ id: 'detectionInfo' }),
      dataIndex: 'name',
      width: '25%',
      tzEllipsis: 2,
    },
    {
      title: intl.formatMessage({ id: 'concreteContent' }),
      dataIndex: 'description',
    },

    {
      title: intl.formatMessage({ id: 'severityLevel' }),
      dataIndex: 'severity',
      align: 'center',
      width: '12%',
    },
  ];

  return (
    <TzProTable<API.RisksDatum>
      onRow={(record) => {
        return {
          onClick: () => {
            history.push(`/risks/info/${record.id}`);
          },
        };
      }}
      request={async (dp) => {
        const { total, items } = await getRisks(dp);
        return { total, data: items || [] };
      }}
      columns={columns}
    />
  );
};

export default Page1;
