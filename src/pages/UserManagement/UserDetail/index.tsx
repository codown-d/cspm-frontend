import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import { ToolTipAny } from '@/components/ToolTipAny';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import TzProDescriptions, {
  renderWithLinkEllipsis,
} from '@/components/lib/ProComponents/TzProDescriptions';
import { TzButton } from '@/components/lib/tz-button';
import { TzCard } from '@/components/lib/tz-card';
import { useUserEnum } from '@/hooks/enum/useUserEnum';
import { renderCommonStatusTag } from '@/pages/components/RenderRiskTag';
import { getSysUser } from '@/services/cspm/UserController';
import { toDetailIntercept } from '@/utils';
import { DATE_TIME } from '@/utils/constants';
import {
  history,
  useIntl,
  useModel,
  useParams,
  useRouteProps,
} from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import ActionModal, { type ActTypeEnum } from '../components/ActModal';
import OperatRecord, { UserActionLogRefFn } from './OperatRecord';
import './index.less';

export default function UserDetail() {
  const { breadcrumb } = useRouteProps();
  const id: any = useParams().id;
  const modalRef = useRef<any>(null);
  const operatRecordRef = useRef<UserActionLogRefFn>(null);
  const actionRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<API.SysUserDatum>();
  const intl = useIntl();
  const translate = useMemoizedFn((id, val?: any) =>
    intl.formatMessage({ id }, val),
  );
  const { getUserTagInfoByStatus: getTagInfoByStatus } = useUserEnum();
  const { initialState } = useModel('@@initialState');
  const { userInfo } = initialState ?? {};

  const fetchInfo = useMemoizedFn(async () => {
    const res = await getSysUser(id);
    setInfo(res);
    setLoading(false);
  });

  useEffect(() => {
    actionRef.current = {
      reload: () => {
        operatRecordRef.current?.refresh();
        fetchInfo();
      },
    };
    fetchInfo();
  }, []);

  const isEnable = useMemo(() => {
    return info?.status === 'enabled';
  }, [info]);

  const handleOprClick = useMemoizedFn((type: ActTypeEnum | 'edit') => {
    if (type === 'edit') {
      history.push(`/sys/user-management/edit/${id}`);
    } else {
      modalRef.current(type, info || {});
    }
  });

  const infoColumns = [
    {
      title: translate('role'),
      dataIndex: 'role_name',
    },
    {
      title: translate('pointUsage'),
      render: (_: any, record: API.SysUserDatum) => {
        return `${record.credit_used ?? '0'}/${record.credit_limit ?? '-'}`;
      },
    },
    {
      title: translate('phone'),
      dataIndex: 'tel',
    },
    {
      title: translate('mail'),
      dataIndex: 'email',
    },
    {
      title: translate('associatedCloudAccount'),
      className: 'btn-row',
      render() {
        const _names = info?.credentials || [];
        if (!_names.length) {
          return '-';
        }
        return (
          <ToolTipAny className="-ml-2">
            <div className={'vkl3-1'}>
              {_names.map((_item, idx) => (
                <Fragment key={_item.name}>
                  <span>{idx ? ',' : ''}</span>
                  {renderWithLinkEllipsis(_item.name, _item, () =>
                    toDetailIntercept(
                      { type: 'credential', id: _item.id },
                      () =>
                        history.push(`/sys/cloud-platform/info/${_item.id}`),
                    ),
                  )}
                </Fragment>
              ))}
            </div>
          </ToolTipAny>
        );
      },
    },
    {
      title: translate('creator'),
      dataIndex: 'creator',
    },
    {
      title: translate('creationTime'),
      dataIndex: 'created_at',
      render: (_: any, record: API.SysUserDatum) => {
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
      render: (_: any, record: API.SysUserDatum) => {
        return dayjs(record.updated_at).format(DATE_TIME);
      },
    },
    {
      title: translate('remark'),
      dataIndex: 'desc',
    },
  ];

  const extraBar = useMemo(() => {
    if (!info) {
      return;
    }
    return [
      <TzButton key="1" onClick={() => handleOprClick('point')}>
        {translate('allocatePoints')}
      </TzButton>,
      <TzButton key="2" onClick={() => handleOprClick('edit')}>
        {translate('edit')}
      </TzButton>,
      <TzButton key="3" onClick={() => handleOprClick('resetPwd')}>
        {translate('resetPwd')}
      </TzButton>,
      <TzButton
        key="4"
        onClick={() => handleOprClick(isEnable ? 'disabled' : 'enabled')}
      >
        {translate(isEnable ? 'action.disabled' : 'action.enabled')}
      </TzButton>,
      userInfo?.username !== info.username && (
        <TzButton key="5" danger onClick={() => handleOprClick('delete')}>
          {translate('delete')}
        </TzButton>
      ),
    ];
  }, [info]);
  return (
    <TzPageContainer
      header={{
        title: (
          <PageTitle
            title={info?.username ?? '-'}
            tag={
              <div className="ml-3">
                {renderCommonStatusTag(
                  {
                    getTagInfoByStatus,
                    status: info?.status,
                  },
                  { size: 'small', noEmpty: true },
                )}
              </div>
            }
          />
        ),
        breadcrumb: <PageBreadCrumb items={breadcrumb} />,
      }}
      extra={extraBar}
    >
      <div className="flex">
        <div className="flex-1">
          <TzCard
            bodyStyle={
              loading ? { padding: '4px 16px 16px 16px' } : { paddingTop: 4 }
            }
            id="info"
            className="is-descriptions"
            title={translate('basicInfo')}
          >
            <TzProDescriptions
              loading={loading}
              dataSource={info}
              columns={infoColumns}
            />
          </TzCard>
          <TzCard
            style={{ marginTop: 20 }}
            title={translate('operationRecord')}
            bodyStyle={{ paddingTop: 0 }}
          >
            <OperatRecord ref={operatRecordRef} id={id} />
          </TzCard>
        </div>
      </div>
      <ActionModal ref={modalRef} actionRef={actionRef} />
    </TzPageContainer>
  );
}
