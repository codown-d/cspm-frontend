import TzProTable, {
  TzProColumns,
} from '@/components/lib/ProComponents/TzProTable';
import useTableAnchor from '@/hooks/useTableAnchor';
import { getActLog, IUserActionLog } from '@/services/cspm/UserController';
import { DATE_TIME } from '@/utils/constants';
import { ActionType } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import React, { useRef } from 'react';

const UserActionLog: React.FC<{ id: string }> = (props) => {
  const { id } = props;
  const actionRef = useRef<ActionType>();
  const anchorRef = useRef<HTMLDivElement>(null);
  const listOffsetFn = useTableAnchor(anchorRef);
  const intl = useIntl();
  const translate = useMemoizedFn((id, val?: any) =>
    intl.formatMessage({ id }, val),
  );

  const columns: TzProColumns<IUserActionLog>[] = [
    {
      title: translate('occurrenceTime'),
      width: 200,
      render: (_: any, record: IUserActionLog) => {
        return dayjs(record.created_at).format(DATE_TIME);
      },
    },
    {
      title: translate('operator'),
      dataIndex: 'creator',
    },
    {
      title: translate('concreteBehavior'),
      dataIndex: 'operator',
    },
  ];

  const requestFn = useMemoizedFn(async ({ pageSize: size, current: page }) => {
    const { total, items } = await getActLog({
      uid: id,
      size,
      page,
    });
    return { total, data: items || [] };
  });

  return (
    <TzProTable<IUserActionLog>
      rowKey={'created_at'}
      onChange={listOffsetFn}
      className="no-hover-table mt-2"
      actionRef={actionRef}
      request={requestFn}
      columns={columns}
    />
  );
};

export default UserActionLog;
