import TzProTable, {
  TzProColumns,
} from '@/components/lib/ProComponents/TzProTable';
import { TzRadio } from '@/components/lib/tz-radio';
import { ZH_LANG } from '@/locales';
import { getPermisionList } from '@/services/cspm/RoleManage';
import { getLocale, useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
// import { Radio } from 'antd';
import { forwardRef, useImperativeHandle, useMemo } from 'react';

interface IProps {
  value?: Record<string, API.Permision['action']>;
  onChange?: any;
  preview?: boolean;
  [k: string]: any;
}

const PermisionTable = forwardRef((props: IProps, ref) => {
  const { value: permisVal = {}, onChange, preview, ...restProps } = props;
  const intl = useIntl();
  const translate = useMemoizedFn((id, val?: any) =>
    intl.formatMessage({ id }, val),
  );

  const requestPermis = useMemoizedFn(async (param) => {
    const _permisVal = param.permisV ?? {};
    const res = await getPermisionList();
    const list = res || [];
    const _permi = list.reduce((acc, cur) => {
      acc[cur.key] = _permisVal[cur.key] || cur.default;
      return acc;
    }, {} as any);
    onChange?.(_permi);
    return { data: list, total: list.length };
  });

  const onChangeRadio = useMemoizedFn((_record, rw) => {
    onChange?.({
      ...permisVal,
      [_record.key]: rw,
    });
  });

  const columns: TzProColumns<API.PermisionListResponse>[] = useMemo(() => {
    const cols: TzProColumns<API.PermisionListResponse>[] = [
      {
        title: translate('module'),
        dataIndex: 'name',
        width: '20%',
        render: (txt) => {
          return <span style={{ whiteSpace: 'pre-wrap' }}>{txt}</span>;
        },
      },
      {
        title: translate('permissionDescription'),
        dataIndex: 'desc',
        // tzEllipsis: 2,
        render: (txt) => {
          return <span style={{ whiteSpace: 'pre-wrap' }}>{txt}</span>;
        },
      },
      {
        title: translate('permission'),
        width: '10%',
        render(_: unknown, record: any) {
          return translate(`permission.${permisVal[record.key]}`);
        },
      },
    ];
    if (!preview) {
      const isZh = getLocale() === ZH_LANG;
      const colW = isZh ? 66 : 100;
      const editCols: TzProColumns<API.PermisionListResponse>[] = [
        {
          title: translate('readWrite'),
          key: 'rw',
          width: colW,
          align: 'center',
          render: (_: unknown, record) => {
            return (
              <TzRadio
                disabled={!record.actions?.includes('readwrite')}
                onChange={(v) => onChangeRadio(record, 'readwrite')}
                checked={permisVal[record.key] === 'readwrite'}
              />
            );
          },
        },
        {
          title: translate('readOnly'),
          key: 'r',
          width: colW,
          align: 'center',
          render: (_: unknown, record) => {
            return (
              <TzRadio
                disabled={!record.actions?.includes('readonly')}
                onChange={() => onChangeRadio(record, 'readonly')}
                checked={permisVal[record.key] === 'readonly'}
              />
            );
          },
        },
        {
          title: translate('noPermission'),
          key: 'none',
          width: colW,
          align: 'center',
          render: (_: unknown, record) => {
            return (
              <TzRadio
                disabled={!record.actions?.includes('deny')}
                onChange={() => onChangeRadio(record, 'deny')}
                checked={permisVal[record.key] === 'deny'}
              />
            );
          },
        },
      ];
      cols.pop();
      cols.push(...editCols);
    }
    return cols;
  }, [preview, permisVal]);

  useImperativeHandle(ref, () => {
    return {
      refresh(permisV: Record<string, any>) {
        requestPermis({ permisV });
      },
    };
  });

  return (
    <TzProTable<API.PermisionListResponse>
      {...restProps}
      rowKey={'key'}
      request={requestPermis}
      columns={columns}
      className="no-hover-table"
    />
  );
});

export default PermisionTable;
