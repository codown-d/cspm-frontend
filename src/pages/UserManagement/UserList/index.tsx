import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import { TzButton } from '@/components/lib/tz-button';
import { history, useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import React from 'react';
import UserTable from './UserTable';

const UserList: React.FC<unknown> = () => {
  const intl = useIntl();
  const translate = useMemoizedFn((id, val?: any) =>
    intl.formatMessage({ id }, val),
  );
  return (
    <TzPageContainer
      header={{
        title: translate('userManagement'),
      }}
      extra={[
        <TzButton
          key="baselineManagement"
          type="default"
          onClick={() => {
            history.push('/sys/user-management/role-list');
          }}
          // icon={<i className="icon iconfont icon-leixing" />}
        >
          {translate('roleManagement')}
        </TzButton>,
        <TzButton
          key="scannerRecorder"
          onClick={() => {
            history.push('/sys/user-management/management-config');
          }}
          // icon={<i className="icon iconfont icon-jingxiangsaomiao-peizhi" />}
        >
          {translate('config')}
        </TzButton>,
      ]}
    >
      <UserTable />
    </TzPageContainer>
  );
};

export default UserList;
