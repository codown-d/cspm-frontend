import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import { IState } from '@/interface';
import { renderCommonStatusTag } from '@/pages/components/RenderRiskTag';
import { getPolicyById } from '@/services/cspm/CloudPlatform';
import { getPolicyHistory } from '@/services/cspm/Risks';
import { useLocation, useParams, useRouteProps } from '@umijs/max';
import { Skeleton } from 'antd';
import { get } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import AssetWithRisk from './AssetWithRisk';
import CredentialWithRisk from './CredentialWithRisk';
import Info from './Info';
import VerifyModal from './VerifyModal';

type TState = IState & {
  compliance_content_id?: string;
  credential_ids?: number[];
  policy_type?: string;
  entity_type?: string;
  status?: API_ASSETS.Status;
};
const breadcrumbs = {
  compliance: [
    {
      title: 'complianceSafety',
      path: '/compliance',
    },
    {
      title: 'configRiskInfo',
    },
  ],
};

const getBreadcrumbs = (p: IState) => {
  const { from, task_id } = p ?? {};
  if (from === 'task') {
    return [
      {
        title: 'task',
        path: '/task',
      },
      {
        title: 'complianceDetectionTaskDetails',
        path: `/task/compliance/detail/${task_id}`,
      },
      {
        title: 'configRiskInfo',
      },
    ];
  }
  if (from === 'compliance') {
    return [
      {
        title: 'complianceSafety',
        path: '/compliance',
      },
      {
        title: 'configRiskInfo',
      },
    ];
  }
  return;
};
function ConfigInfo() {
  const { id } = useParams();
  const [info, setInfo] = useState<API.PolicyInfoResponse>();
  const [loading, setLoading] = useState<boolean>();
  const { breadcrumb } = useRouteProps();
  const { getSeverityTagInfoByStatus: getTagInfoByStatus } = useSeverityEnum();

  const { state } = useLocation();
  const {
    compliance_content_id,
    credential_ids,
    policy_type,
    entity_type,
    task_id,
    status,
    from = 'risk',
  } = (state as TState) ?? {};
  const isTask = from === 'task';

  useEffect(() => {
    setLoading(true);
    if (!id) {
      return;
    }
    let params = {
      id,
      type: policy_type,
    };
    let fetchUrl = getPolicyById;
    if (isTask) {
      fetchUrl = getPolicyHistory;
      params = { ...params, task_id };
    }
    fetchUrl(params)
      .then(setInfo)
      .finally(() => setLoading(false));
  }, [id, state]);
  const complianceInfo = useMemo(
    () => ({
      compliance_content_id,
      credential_ids: credential_ids?.map((v: string) => +v),
    }),
    [compliance_content_id, credential_ids],
  );
  const policyType = get(info, 'policy_type');
  // const isProgram = get(info, 'policy_type') === 'program';
  const isManual = policyType === 'manual';
  const showAsset = entity_type === 'asset';
  // const showAsset =
  //   (isProgram && relativeIsAsset) || (isManual && get(info, 'service'));

  const _breadcrumb = useMemo(() => {
    return getBreadcrumbs(state as IState) ?? breadcrumb;
  }, [state]);
  return (
    <TzPageContainer
      extra={[
        isManual && !isTask ? <VerifyModal record={{ policy_id: id }} /> : null,
      ]}
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
            title={info?.policy_title ?? '-'}
          />
        ),
        breadcrumb: <PageBreadCrumb items={_breadcrumb} />,
      }}
    >
      <div className="flex gap-3">
        <Info
          optionals={['status', 'assets_count']}
          className="basis-80"
          dataSource={info}
          loading={loading}
        />
        <div className="flex-1">
          {!!info ? (
            showAsset ? (
              <AssetWithRisk
                complianceInfo={complianceInfo}
                status={from === 'risk' ? status : undefined}
                policyInfo={{ policy_id: id, policy_type: policyType }}
              />
            ) : (
              <CredentialWithRisk
                status={from === 'risk' ? status : undefined}
                policy_id={id}
                policy_type={policyType}
                {...complianceInfo}
              />
            )
          ) : (
            <Skeleton />
          )}
        </div>
      </div>
    </TzPageContainer>
  );
}

export default ConfigInfo;
