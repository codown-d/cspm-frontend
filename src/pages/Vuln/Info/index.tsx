import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import { TzButton } from '@/components/lib/tz-button';
import { TzCard } from '@/components/lib/tz-card';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import useBreadcrumb from '@/hooks/useBreadcrumb';
import { renderCommonStatusTag } from '@/pages/components/RenderRiskTag';
import { getVulnRisksById } from '@/services/cspm/Agentless';
import { useIntl, useLocation, useParams, useRouteProps } from '@umijs/max';
import { ItemType } from 'antd/lib/breadcrumb/Breadcrumb';
import { useEffect, useState } from 'react';
import Export from '../List/Export';
import Info from './Info';
import RiskAssetsList from './RiskAssetsList';

type TState = API_AGENTLESS.VulnRisksDatum & {
  task_id?: number;
  infoBreadcrumb?: ItemType[];
};
function VulnInfo() {
  const { id } = useParams();
  const { state } = useLocation();
  const intl = useIntl();
  const { task_id, infoBreadcrumb } = (state as TState) ?? {};
  const curBreadcrumb = useBreadcrumb(infoBreadcrumb);
  const [info, setInfo] = useState<API_AGENTLESS.VulnRiskInfoResponse>();
  const [loading, setLoading] = useState<boolean>();
  const { breadcrumb } = useRouteProps();
  const { getSeverityTagInfoByStatus: getTagInfoByStatus } = useSeverityEnum();

  useEffect(() => {
    setLoading(true);
    if (!id) {
      return;
    }
    // 漏洞详情不区分是否是快照，直接用unique_id查询
    getVulnRisksById(id)
      .then(setInfo)
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <TzPageContainer
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
        breadcrumb: <PageBreadCrumb items={breadcrumb} />,
      }}
      extra={
        <Export
          tip={false}
          fileName={info?.name}
          parameter={{ unique_id: id }}
          renderTrigger={
            <TzButton
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {intl.formatMessage({ id: 'export' })}
            </TzButton>
          }
        />
      }
    >
      <div className="flex gap-3">
        <Info className="basis-80" dataSource={info} loading={loading} />
        <TzCard
          bodyStyle={{ padding: '0px 16px 16px 16px' }}
          className="flex-1"
          title={intl.formatMessage({ id: 'relativeAsset' })}
        >
          <RiskAssetsList
            infoBreadcrumb={
              infoBreadcrumb
                ? [
                    ...curBreadcrumb,
                    {
                      title: 'assetInfo',
                    },
                  ]
                : undefined
            }
            isHistory={!!task_id}
            defaultParams={{
              vuln_unique_id: id,
              task_id,
            }}
          />
        </TzCard>
      </div>
    </TzPageContainer>
  );
}

export default VulnInfo;
