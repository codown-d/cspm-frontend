import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import { TzButton } from '@/components/lib/tz-button';
import { TzCard } from '@/components/lib/tz-card';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import { renderCommonStatusTag } from '@/pages/components/RenderRiskTag';
import { getRuleSensitiveById } from '@/services/cspm/CloudPlatform';
import { useIntl, useLocation, useParams, useRouteProps } from '@umijs/max';
import { ItemType } from 'antd/lib/breadcrumb/Breadcrumb';
import { useEffect, useState } from 'react';
import Export from '../List/Export';
import RiskAssetsList from './RiskAssetsList';

type TState = API_AGENTLESS.SensitiveRisksDatum & {
  task_id?: number;
  infoBreadcrumb?: ItemType[];
};
function RuleSensitiveInfo() {
  const { id } = useParams();
  const { state } = useLocation() ?? {};
  const { task_id, infoBreadcrumb } = (state as TState) ?? {};

  const intl = useIntl();
  const { getSeverityTagInfoByStatus: getTagInfoByStatus } = useSeverityEnum();

  const { breadcrumb } = useRouteProps();
  const [info, setInfo] = useState<API_AGENTLESS.RuleSensitiveInfoResponse>();

  useEffect(() => {
    if (!id) {
      return;
    }
    getRuleSensitiveById(id).then(setInfo);
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
            title={info?.title ?? '-'}
          />
        ),
        breadcrumb: <PageBreadCrumb items={breadcrumb} />,
      }}
      extra={
        <Export
          tip={false}
          fileName={info?.title}
          parameter={{ unique_id: id }}
          renderTrigger={
            <TzButton
              disabled={!info}
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
      <TzCard
        bodyStyle={{ padding: '0px 16px 16px 16px' }}
        className="flex-1"
        title={intl.formatMessage({ id: 'relativeAsset' })}
      >
        <RiskAssetsList
          defaultParams={{
            sensitive_rule_unique_id: id,
            task_id,
          }}
          isHistory={!!task_id}
        />
      </TzCard>
    </TzPageContainer>
  );
}

export default RuleSensitiveInfo;
