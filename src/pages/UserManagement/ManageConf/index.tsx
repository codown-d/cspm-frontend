import React from 'react';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import { useIntl, useRouteProps } from '@umijs/max';
import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import LoginConf from './LoginConf';
import { useMemoizedFn } from 'ahooks';

const ManageConf: React.FC = () => {
  const { breadcrumb } = useRouteProps();
  const intl = useIntl();
  const translate = useMemoizedFn((id, val?: any) => intl.formatMessage({ id }, val));

  return (
    <TzPageContainer
      header={{
        title: <PageTitle title={translate('config')} />,
        breadcrumb: <PageBreadCrumb items={breadcrumb} />,
      }}
    >
      <LoginConf />
    </TzPageContainer>
  );
};

export default ManageConf;
