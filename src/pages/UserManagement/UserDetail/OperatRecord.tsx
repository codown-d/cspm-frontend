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
import {
  ForwardedRef,
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
} from 'react';
export type UserActionLogRefFn = { refresh: VoidFunction };
const UserActionLog = (
  props: { id: string },
  ref: ForwardedRef<UserActionLogRefFn>,
) => {
  const { id } = props;
  const anchorRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<ActionType>(null);
  const listOffsetFn = useTableAnchor(anchorRef);
  const intl = useIntl();
  const translate = useMemoizedFn((id, val?: any) =>
    intl.formatMessage({ id }, val),
  );

  useImperativeHandle(ref, () => {
    return {
      refresh() {
        actionRef.current?.reload();
      },
    };
  });

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
      width: '45%',
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
    <>
      <div className="absolute top-0" ref={anchorRef} />
      <TzProTable<IUserActionLog>
        rowKey={'created_at'}
        onChange={listOffsetFn}
        className="no-hover-table mt-2"
        request={requestFn}
        columns={columns}
        actionRef={actionRef}
      />
    </>
  );
};

export default memo(forwardRef(UserActionLog));
