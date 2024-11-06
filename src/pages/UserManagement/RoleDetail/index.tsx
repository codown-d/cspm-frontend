import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import TzProDescriptions from '@/components/lib/ProComponents/TzProDescriptions';
import { TzButton } from '@/components/lib/tz-button';
import { TzCard } from '@/components/lib/tz-card';
import { TzConfirm } from '@/components/lib/tzModal';
import UserList from '@/pages/UserManagement/UserList/UserTable';
import PermisionTable from '@/pages/UserManagement/components/PermisionTable';
import { delRole, getRoleDetail } from '@/services/cspm/RoleManage';
import { DATE_TIME } from '@/utils/constants';
import { useLocation } from '@@/exports';
import { history, useIntl, useParams, useRouteProps } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

interface IInfo extends Omit<API.RoleListResponse, 'permissions'> {
  permisMap: Record<string, API.Permision['action']>;
}
export default function RoleDetail() {
  const { breadcrumb } = useRouteProps();
  const id: any = useParams().id;
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<IInfo>({} as any);
  const filterContainer = useRef<HTMLDivElement>(null);
  const intl = useIntl();
  const translate = useMemoizedFn((id, val?: any) =>
    intl.formatMessage({ id }, val),
  );

  const fetchInfo = useMemoizedFn(async () => {
    const { permissions, ...arg } = await getRoleDetail(id);
    const p = permissions.reduce(
      (acc, item: API.Permision) => {
        acc[item.key] = item.action;
        return acc;
      },
      {} as Record<string, API.Permision['action']>,
    );

    setInfo({ ...arg, permisMap: p });
    setLoading(false);
  });

  useEffect(() => {
    fetchInfo();
  }, []);

  const goListPage = useMemoizedFn(() => {
    history.replace('/sys/user-management/role-list');
  });
  const handleOprClick = useMemoizedFn((type: '删除' | 'edit') => {
    if (type === 'edit') {
      history.push(`/sys/user-management/role-edit/${id}`);
      return;
    }
    TzConfirm({
      title: false,
      okButtonProps: {
        danger: true,
      },
      content: translate('unStand.deleteBaseLine', {
        type: translate('role'),
        name: info.name,
      }),
      onOk: () => {
        delRole(info.id).then(() => {
          message.success(translate('oprSuc', { name: translate('delete') }));
          goListPage();
        });
      },
      okText: translate('delete'),
    });
  });

  const infoColumns = [
    {
      title: translate('creator'),
      dataIndex: 'creator',
    },
    {
      title: translate('creationTime'),
      dataIndex: 'created_at',
      render: (_: any, record: API.RoleListResponse) => {
        return dayjs(record.created_at).format(DATE_TIME);
      },
    },
    {
      title: translate('updater'),
      dataIndex: 'updater',
    },
    {
      title: translate('turnoverTime'),
      dataIndex: 'updated_at',
      render: (_: any, record: API.RoleListResponse) => {
        return dayjs(record.updated_at).format(DATE_TIME);
      },
    },
    {
      title: translate('remark'),
      dataIndex: 'desc',
    },
  ];

  return (
    <TzPageContainer
      header={{
        title: <PageTitle title={info?.name ?? '-'} />,
        breadcrumb: <PageBreadCrumb items={breadcrumb} />,
      }}
      extra={[
        <TzButton key="2" onClick={() => handleOprClick('edit')}>
          {translate('edit')}
        </TzButton>,
        <TzButton key="5" danger onClick={() => handleOprClick('删除')}>
          {translate('delete')}
        </TzButton>,
      ]}
    >
      <TzCard
        bodyStyle={
          loading ? { padding: '4px 16px 16px 16px' } : { paddingTop: 4 }
        }
        id="1"
        className="is-descriptions"
        title={translate('basicInfo')}
      >
        <TzProDescriptions
          loading={loading}
          dataSource={info as any}
          columns={infoColumns}
        />
      </TzCard>
      <TzCard
        style={{ marginTop: 20 }}
        id="2"
        title={translate('rolePermissions')}
        bodyStyle={{ paddingTop: 0 }}
      >
        <PermisionTable value={info.permisMap || {}} preview />
      </TzCard>
      <TzCard
        style={{ marginTop: 20 }}
        id="2"
        title={translate('userList')}
        bodyStyle={{ paddingTop: 0 }}
        extra={<div ref={filterContainer}></div>}
      >
        <UserList inRolePage filterContainer={filterContainer} roleId={id} />
      </TzCard>
    </TzPageContainer>
  );
}
