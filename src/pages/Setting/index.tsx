import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import { useIntl, useRouteProps } from '@umijs/max';
import BasicInfo from './BasicInfo';
import Tags from './Tags';

function Setting() {
  const intl = useIntl();
  const { breadcrumb } = useRouteProps();
  return (
    <TzPageContainer
      className="info-card-box"
      header={{
        title: <PageTitle title={intl.formatMessage({ id: 'setting' })} />,
        breadcrumb: <PageBreadCrumb items={breadcrumb} />,
      }}
    >
      <BasicInfo />
      <Tags />
    </TzPageContainer>
  );
}

export default Setting;
