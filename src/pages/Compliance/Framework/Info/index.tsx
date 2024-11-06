import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import { TzButton } from '@/components/lib/tz-button';
import { TzSwitch } from '@/components/lib/tz-switch';
import { history, useIntl, useRouteProps } from '@umijs/max';
import BasicInfo from './BasicInfo';
import ComplianceItems from './ComplianceItems';
import useInfo from './useInfo';

function Info() {
  const intl = useIntl();
  const {
    info,
    handleOprClick,
    loading,
    coplianceTreeData,
    filterCompliancePolicies,
  } = useInfo();
  const { breadcrumb } = useRouteProps();

  return (
    <TzPageContainer
      header={{
        title: (
          <PageTitle
            title={info?.name ?? '-'}
            tag={
              <TzSwitch
                size="small"
                checked={!!info?.status}
                style={{ marginLeft: '12px' }}
                onChange={() =>
                  handleOprClick('switch', () => {
                    history.replace(`/compliance/framework/info/${info?.id}`, {
                      keepAlive: true,
                    });
                  })
                }
              />
            }
          />
        ),
        breadcrumb: <PageBreadCrumb items={breadcrumb} />,
      }}
      extra={[
        <TzButton key="1" onClick={() => handleOprClick('createCopy')}>
          {intl.formatMessage({ id: 'createCopy' })}
        </TzButton>,
        <TzButton key="2" onClick={() => handleOprClick('edit')}>
          {intl.formatMessage({ id: 'edit' })}
        </TzButton>,
        <TzButton
          key="3"
          danger
          onClick={() =>
            handleOprClick('delete', () => {
              history.replace('/compliance/framework');
            })
          }
        >
          {intl.formatMessage({ id: 'delete' })}
        </TzButton>,
      ]}
    >
      <BasicInfo dataSource={info} loading={loading} />
      <ComplianceItems
        treeData={coplianceTreeData}
        filterCompliancePolicies={filterCompliancePolicies}
      />
    </TzPageContainer>
  );
}

export default Info;
