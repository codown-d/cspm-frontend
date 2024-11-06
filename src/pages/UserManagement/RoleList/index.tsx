import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import TzProTable, {
  TzProColumns,
} from '@/components/lib/ProComponents/TzProTable';
import TzFilter from '@/components/lib/TzFilter';
import useTzFilter, {
  FilterContext,
} from '@/components/lib/TzFilter/useTzFilter';
import TzFilterForm from '@/components/lib/TzFilterForm';
import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import TzTypography from '@/components/lib/TzTypography';
import { TzButton } from '@/components/lib/tz-button';
import { TzConfirm } from '@/components/lib/tzModal';
import useRefreshTable from '@/hooks/useRefreshTable';
import useTableAnchor from '@/hooks/useTableAnchor';
import { EN_LANG } from '@/locales';
import { delRole, getRoleList } from '@/services/cspm/RoleManage';
import { DATE_TIME } from '@/utils/constants';
import { ActionType } from '@ant-design/pro-components';
import { getLocale, history, useIntl, useRouteProps } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Space, message } from 'antd';
import dayjs from 'dayjs';
import React, { useMemo, useRef, useState } from 'react';

const RoleList: React.FC<unknown> = () => {
  const { breadcrumb } = useRouteProps();
  // const [keyword, setKeyword] = useState<string>();
  const actionRef = useRef<ActionType>();
  const anchorRef = useRef<HTMLDivElement>(null);
  const listOffsetFn = useTableAnchor(anchorRef);
  const intl = useIntl();
  useRefreshTable(actionRef);
  const translate = useMemoizedFn((id, val?: any) =>
    intl.formatMessage({ id }, val),
  );

  const filterData: FilterFormParam[] = useMemo(() => {
    return [
      {
        label: translate('pleaseInputRoleName'),
        name: 'name',
        type: 'input',
        icon: 'icon-mingmingkongjian',
      },
    ];
  }, []);
  const dataFilter = useTzFilter({ initial: filterData });
  const [filterVal, setFilterVal] = useState<any>({});
  // 操作列
  const oprFn = useMemoizedFn((type, record) => {
    if (type === 'delete') {
      TzConfirm({
        title: false,
        okButtonProps: {
          danger: true,
        },
        content: translate('unStand.deleteBaseLine', {
          type: translate('role'),
          name: record.name,
        }),
        onOk: () => {
          delRole(record.id).then(() => {
            message.success(translate('oprSuc', { name: translate('delete') }));
            actionRef.current?.reload?.();
          });
        },
        okText: translate('delete'),
      });
      return;
    }
  });

  const columns: TzProColumns<API.RoleListResponse>[] = [
    {
      title: translate('roleName'),
      dataIndex: 'name',
      ellipsis: {
        showTitle: true,
      },
      width: '15%',
      tzEllipsis: 2,
      // render: (_, record) => (
      //   <Highlighter
      //     className="highlight"
      //     searchWords={keyword ? [keyword] : []}
      //     autoEscape={false}
      //     textToHighlight={record.name}
      //   />
      // ),
    },
    {
      title: translate('rolePermissions'),
      ellipsis: {
        showTitle: true,
      },
      tzEllipsis: 2,
      render: (_, record) => {
        const txt = (record.permissions || [])
          .map((item) => {
            const act = translate(`permission.${item.action}`);
            return `${item.name || '-'}(${act})`;
          })
          .join(' | ');
        return (
          <TzTypography.Paragraph ellipsis={{ rows: 2, tooltip: txt }}>
            {txt}
          </TzTypography.Paragraph>
        );
      },
    },
    {
      title: translate('remark'),
      dataIndex: 'desc',
      tzEllipsis: 2,
      width: '15%',
      ellipsis: {
        showTitle: true,
      },
    },
    {
      title: translate('turnoverTime'),
      dataIndex: 'updated_at',
      width: '15%',
      render: (_, record) => {
        return dayjs(record.updated_at).format(DATE_TIME);
      },
    },
    {
      title: translate('operate'),
      dataIndex: 'option',
      width: getLocale() === EN_LANG ? 100 : 100,
      render: (_, record) => {
        return (
          <Space
            size={4}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              return false;
            }}
          >
            <TzButton
              style={{ marginLeft: -8 }}
              size="small"
              type="text"
              onClick={() => {
                history.push(`/sys/user-management/role-edit/${record.id}`);
              }}
            >
              {translate('edit')}
            </TzButton>
            <TzButton
              danger
              size="small"
              type="text"
              onClick={() => oprFn('delete', record)}
            >
              {translate('delete')}
            </TzButton>
          </Space>
        );
      },
    },
  ];

  const requestFn = useMemoizedFn(async (dp) => {
    const { total, items } = await getRoleList(dp);
    return { total, data: items || [] };
  });

  return (
    <TzPageContainer
      header={{
        title: <PageTitle title={translate('roleManagement')} />,
        breadcrumb: <PageBreadCrumb items={breadcrumb} />,
      }}
    >
      <div className="absolute top-0" ref={anchorRef} />
      <FilterContext.Provider value={{ ...dataFilter }}>
        <div className="flex justify-between">
          <div className="flex gap-x-[6px]">
            <TzFilter />
            <TzFilterForm hideToolBar onChange={(v) => setFilterVal(v)} />
          </div>
          <TzButton
            key="1"
            type="primary"
            onClick={() => history.push('/sys/user-management/role-add')}
          >
            {translate('add')}
          </TzButton>
        </div>
      </FilterContext.Provider>
      <TzProTable<API.RoleListResponse>
        onChange={listOffsetFn}
        className="mt-2"
        actionRef={actionRef}
        params={filterVal}
        request={requestFn}
        columns={columns}
        onRow={(record) => {
          return {
            onClick: () => {
              history.push(`/sys/user-management/role-detail/${record.id}`);
            },
          };
        }}
      />
    </TzPageContainer>
  );
};

export default RoleList;
