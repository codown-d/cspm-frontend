import TzProTable, {
  TzProColumns,
} from '@/components/lib/ProComponents/TzProTable';
import useTableAnchor from '@/hooks/useTableAnchor';
import { getOperateLog } from '@/services/cspm/Task';
import { ActionType } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import React, { useRef } from 'react';

const ActLog: React.FC<{
  id: string;
  isRisk: boolean;
}> = (props) => {
  const { id, isRisk } = props;
  const actionRef = useRef<ActionType>();
  const anchorRef = useRef<HTMLDivElement>(null);
  const listOffsetFn = useTableAnchor(anchorRef);
  const intl = useIntl();
  const translate = useMemoizedFn((id, val?: any) =>
    intl.formatMessage({ id }, val),
  );

  const columns: TzProColumns<any>[] = [
    {
      title: translate('occurrenceTime'),
      dataIndex: 'created_at',
      width: '25%',
      sorter: true,
      valueType: 'dateTime',
    },
    {
      title: translate('username'),
      width: '25%',
      dataIndex: 'creator',
      tzEllipsis: 1,
    },
    {
      title: translate('concreteBehavior'),
      dataIndex: 'action',
      width: '50%',
      tzEllipsis: 2,
    },
  ];

  const requestFn = useMemoizedFn(async (dp, sorter) => {
    const { total, items } = await getOperateLog({
      ...sorter,
      ...dp,
    });
    return { total, data: items || [] };
  });

  return (
    <TzProTable<any>
      params={{ type: 'assets_scan', id }}
      rowKey={'created_at'}
      onChange={listOffsetFn}
      className="no-hover-table"
      actionRef={actionRef}
      request={requestFn}
      columns={columns}
    />
  );
};

export default ActLog;
