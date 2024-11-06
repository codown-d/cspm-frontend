import TzProTable, {
  TzProColumns,
  onRowClick,
} from '@/components/lib/ProComponents/TzProTable';
import TzFilter from '@/components/lib/TzFilter';
import useTzFilter, {
  FilterContext,
} from '@/components/lib/TzFilter/useTzFilter';
import TzFilterForm from '@/components/lib/TzFilterForm';
import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import { TzButton } from '@/components/lib/tz-button';
import { TzDropdown } from '@/components/lib/tz-dropdown';
import { TzTooltip } from '@/components/lib/tz-tooltip';
import { useUserEnum } from '@/hooks/enum/useUserEnum';
import { useUserAccountLimit } from '@/hooks/useLoginConf';
import useRefreshTable from '@/hooks/useRefreshTable';
import useTableAnchor from '@/hooks/useTableAnchor';
import { ZH_LANG } from '@/locales';
import { renderCommonStatusTag } from '@/pages/components/RenderRiskTag';
import { getRoleList } from '@/services/cspm/RoleManage';
import { querySysUserList } from '@/services/cspm/UserController';
import { getFilterPannelOpenStatus } from '@/utils';
import { ActionType } from '@ant-design/pro-components';
import { getLocale, history, useIntl, useModel } from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import { Space } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ActionModal from '../components/ActModal';
import RestPwdPopup from '../components/ResetPassword';
import './index.less';

interface IOption {
  label: string;
  value: string;
}

const StatusActMap: Record<string, string> = {
  locked: 'unlock',
  disabled: 'enabled',
  enabled: 'disabled',
};

const UserList: React.FC<{
  inRolePage?: boolean;
  filterContainer?: any;
  roleId?: string;
}> = (props) => {
  const { inRolePage, filterContainer, roleId } = props;
  const [resetPwdId, setResetPwdId] = useState('');
  const actionRef = useRef<ActionType>();
  const anchorRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<any>(null);
  const listOffsetFn = useTableAnchor(anchorRef);
  const [roleOptions, setRoleOptions] = useState<IOption[]>([]);
  const [accountTotal, setAccountTotal] = useState(0);
  const accountNumLimit = useUserAccountLimit();
  const intl = useIntl();
  const { userStatusEnum, getUserTagInfoByStatus: getTagInfoByStatus } =
    useUserEnum();
  const isZh = getLocale() === ZH_LANG;
  const translate = useMemoizedFn((id, val?: any) =>
    intl.formatMessage({ id }, val),
  );
  useRefreshTable(actionRef);
  const { initialState } = useModel('@@initialState');
  const { userInfo } = initialState ?? {};

  const oprFn = useMemoizedFn((type, record) => {
    if (getFilterPannelOpenStatus()) {
      return;
    }
    modalRef.current(type, record);
  });

  const filterData: FilterFormParam[] = useMemo(() => {
    const opts: FilterFormParam[] = [
      {
        label: translate('account'),
        name: 'account',
        type: 'input',
        icon: 'icon-yonghuming',
      },
      {
        label: translate('role'),
        name: 'role_ids',
        type: 'select',
        icon: 'icon-yonghujiaose',
        props: {
          mode: 'multiple',
          options: roleOptions,
        },
      },
      {
        label: translate('status'),
        name: 'status',
        type: 'select',
        icon: 'icon-celveguanli',
        props: {
          mode: 'multiple',
          options: userStatusEnum,
          defaultActiveFirstOption: false,
        },
      },
    ];
    if (inRolePage) {
      return opts.filter((item) => item.name !== 'role_ids');
    }
    return opts;
  }, [roleOptions, inRolePage]);
  const dataFilter = useTzFilter({ initial: filterData });
  const [filterVal, setFilterVal] = useState<any>({});
  useUpdateEffect(() => {
    dataFilter.updateFilter(filterData);
  }, [roleOptions]);
  const columns: TzProColumns<API.SysUserDatum>[] = useMemo(() => {
    const cols: TzProColumns<API.SysUserDatum>[] = [
      {
        title: translate('account'),
        dataIndex: 'username',
        tzEllipsis: 2,
        // render: (_, record) => {
        //   const _searchWords: string[] = [];
        //   filterVal.account && _searchWords.push(filterVal.account);
        //   return (
        //     <Highlighter
        //       className="highlight"
        //       searchWords={_searchWords}
        //       autoEscape={true}
        //       textToHighlight={record.username!}
        //     />
        //   );
        // },
      },
      {
        title: translate('role'),
        dataIndex: 'role_name',
        tzEllipsis: 2,
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
        title: translate('pointUsage'),
        render(_, record) {
          return `${record.credit_used ?? 0}/${record.credit_limit ?? '-'}`;
        },
      },
      {
        title: translate('numberOfAssociatedCloudAccounts'),
        dataIndex: 'cloud_account_num',
      },
      {
        title: translate('status'),
        dataIndex: 'status',
        // render: (_, record) => {
        //   return <RenderTag type={record.status} data-val={record.status} />;
        // },
        align: 'center',
        render: (status) =>
          renderCommonStatusTag(
            {
              getTagInfoByStatus,
              status,
            },
            { size: 'small' },
          ),
      },
      {
        title: translate('operate'),
        dataIndex: 'option',
        width: isZh ? 170 : 210,
        render: (_, record) => {
          const actBtn: string = StatusActMap[record.status];
          const dropMenu = [
            {
              label: translate(`action.${actBtn}`),
              key: actBtn,
            },
            // {
            //   label: translate('delete'),
            //   key: 'delete',
            // },
          ];
          if (record.username !== userInfo?.username) {
            dropMenu.push({
              label: translate('delete'),
              key: 'delete',
            });
          }
          if (record.status === 'enabled') {
            dropMenu.unshift({
              label: translate('allocatePoints'),
              key: 'point',
            });
          }
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
                  if (getFilterPannelOpenStatus()) {
                    return;
                  }
                  history.push(`/sys/user-management/edit/${record.uid}`);
                }}
              >
                {translate('edit')}
              </TzButton>
              <TzButton
                size="small"
                type="text"
                onClick={() => oprFn('resetPwd', record)}
              >
                {translate('resetPwd')}
              </TzButton>
              <TzDropdown
                trigger={['hover', 'click']}
                menu={{
                  items: dropMenu,
                  onClick: (e) => oprFn(e.key, record),
                }}
                overlayClassName={'drop-down-menu'}
                destroyPopupOnHide={true}
                getPopupContainer={(triggerNode) => triggerNode}
              >
                <TzButton className="more-icon" type="text">
                  <i className={'icon iconfont icon-gengduo1 f20 cabb'} />
                </TzButton>
              </TzDropdown>
            </Space>
          );
        },
      },
    ];
    if (inRolePage) {
      return cols.filter((item) => item.dataIndex !== 'role_name');
    }
    return cols;
  }, [inRolePage, isZh]);

  const requestFn = useMemoizedFn(
    async ({
      pageSize: size,
      current: page,
      account: username,
      ...filterVal2
    }) => {
      const req = {
        size,
        page,
        username,
        ...filterVal2,
      };
      if (inRolePage) {
        req.role_ids = roleId;
      }
      const res = await querySysUserList(req);
      setAccountTotal(res.total);
      return {
        total: res.total,
        data: res.items || [],
      };
    },
  );

  const disableAddBtn = accountNumLimit > 0 && accountTotal >= accountNumLimit;

  useEffect(() => {
    getRoleList({
      // page: 1,
      size: 0,
    }).then((res) => {
      const opts = (res.items || []).map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      setRoleOptions(opts as any);
    });
  }, []);

  return (
    <>
      <FilterContext.Provider value={{ ...dataFilter }}>
        <div className="absolute top-0" ref={anchorRef} />
        <div
          className={`flex ${
            inRolePage ? 'justify-end lxk41' : 'justify-between'
          }`}
        >
          <div className="flex gap-x-[6px] mb-2">
            <TzFilter />
            <TzFilterForm
              className="align-center-input"
              onChange={setFilterVal}
            />
          </div>
          {!inRolePage && (
            <TzTooltip
              title={intl.formatMessage({ id: 'unStand.disableAddAccount' })}
              placement="top"
              disabled={!disableAddBtn}
            >
              <TzButton
                type="primary"
                disabled={disableAddBtn}
                onClick={() => history.push('/sys/user-management/add')}
              >
                {translate('addUser')}
              </TzButton>
            </TzTooltip>
          )}
        </div>
      </FilterContext.Provider>
      <TzProTable<API.SysUserDatum>
        rowKey={'uid'}
        onChange={listOffsetFn}
        actionRef={actionRef}
        params={filterVal}
        request={requestFn}
        columns={columns}
        onRow={(record) => {
          return {
            onClick: () =>
              onRowClick(() =>
                history.push(`/sys/user-management/detail/${record.uid}`),
              ),
          };
        }}
      />
      <RestPwdPopup
        open={!!resetPwdId}
        id={resetPwdId}
        onCancel={() => setResetPwdId('')}
      />
      <ActionModal ref={modalRef} actionRef={actionRef} />
    </>
  );
};

export default UserList;
