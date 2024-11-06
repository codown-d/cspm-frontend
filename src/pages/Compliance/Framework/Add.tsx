import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import { TzButton } from '@/components/lib/tz-button';
import { TzConfirm } from '@/components/lib/tzModal';
import { useIntl, useRouteProps } from '@umijs/max';
import { useRef } from 'react';

function Add() {
  const intl = useIntl();
  const { breadcrumb } = useRouteProps();
  const formValueIsChanged = useRef<boolean>(false);
  return (
    <TzPageContainer
      header={{
        title: (
          <PageTitle
            formChanged={formValueIsChanged}
            title={intl.formatMessage({ id: 'complianceFrameworkAdd' })}
          />
        ),
        breadcrumb: <PageBreadCrumb items={breadcrumb} />,
      }}
      footer={[
        <TzButton
          key="cancel"
          className="cancel-btn"
          onClick={() => {
            if (formValueIsChanged.current) {
              TzConfirm({
                content: intl.formatMessage({ id: 'unStand.cancelTips' }),
                cancelText: intl.formatMessage({ id: 'back' }),
                okButtonProps: {
                  type: 'primary',
                },
                cancelButtonProps: {
                  className: 'cancel-btn',
                },
                onOk() {
                  history.back();
                },
              });
            } else {
              history.back();
            }
          }}
        >
          {intl.formatMessage({ id: 'cancel' })}
        </TzButton>,
        <TzButton key="edit" onClick={() => {}} type="primary">
          {intl.formatMessage({ id: 'add' })}
        </TzButton>,
      ]}
    >
      add
    </TzPageContainer>
  );
}

export default Add;
