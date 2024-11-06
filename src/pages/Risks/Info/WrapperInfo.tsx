import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import useBreadcrumb from '@/hooks/useBreadcrumb';
import { renderCommonStatusTag } from '@/pages/components/RenderRiskTag';
import { useLocation, useRouteProps } from '@umijs/max';
import { ReactNode } from 'react';

type WrapperInfoProps<T> = {
  children: ReactNode;
  info?: {
    severity?: API.PolicySeverity;
    name?: string;
  };
  infoBreadcrumbName?: string;
};
function WrapperInfo<T>({
  children,
  info,
  infoBreadcrumbName,
}: WrapperInfoProps<T>) {
  const { breadcrumb } = useRouteProps();
  const { state } = useLocation();
  const { getSeverityTagInfoByStatus: getTagInfoByStatus } = useSeverityEnum();
  const { infoBreadcrumb } = state ?? {};
  const curBreadcrumb = useBreadcrumb(infoBreadcrumb);

  return (
    <TzPageContainer
      // className="info-card-box"
      header={{
        title: (
          <PageTitle
            showBack
            tag={
              <div className="ml-3 -mt-[6px]">
                {renderCommonStatusTag(
                  {
                    getTagInfoByStatus,
                    status: info?.severity,
                  },
                  true,
                )}
              </div>
            }
            title={info?.name ?? '-'}
          />
        ),
        breadcrumb: (
          <PageBreadCrumb
            items={
              infoBreadcrumb
                ? [
                    ...curBreadcrumb,
                    {
                      title: infoBreadcrumbName,
                    },
                  ]
                : breadcrumb
            }
          />
        ),
      }}
    >
      {children}
    </TzPageContainer>
  );
}

export default WrapperInfo;
