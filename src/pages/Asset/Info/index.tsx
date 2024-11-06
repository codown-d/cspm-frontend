import { PageBreadCrumb, PageTitle } from '@/components/PageHeader';
import TzPageContainer from '@/components/lib/ProComponents/TzPageContainer';
import RelevanceList from '@/pages/Risks/List/RelevanceList';
// import SensitiveRiskList from '@/pages/Risks/List/SensitiveRiskList';
import { TzButton } from '@/components/lib/tz-button';
import { IState } from '@/interface';
import ScanSingleAsset from '@/pages/components/AssetList/ScanSingleAsset';
import {
  getAssetsById,
  getReportsDetailAssetsById,
} from '@/services/cspm/Assets';
import { assetsScan } from '@/services/cspm/CloudPlatform';
import { useIntl, useLocation, useParams, useRouteProps } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { message } from 'antd';
import { memo, useEffect, useMemo, useState } from 'react';
import AssetExport from '../List/AssetExport';
import AssetInfo from './AssetInfo';
import SensitiveRiskList from './SensitiveRiskList';
import VulnList from './VulnList';

const getBreadcrumbs = (p: IState) => {
  const { from, task_id } = p ?? {};
  if (from === 'task') {
    return [
      {
        title: 'task',
        path: '/task',
      },
      {
        title: 'assetDetectionTaskDetails',
        path: `/task/asset/detail/${task_id}`,
      },
      {
        title: 'assetInfo',
      },
    ];
  }
  return;
};
function Info() {
  const { breadcrumb } = useRouteProps();
  const { id } = useParams();
  const { state } = useLocation();
  const { task_id, from } = (state as IState) ?? {};
  const intl = useIntl();
  const isTask = from === 'task';

  const [info, setInfo] = useState<API_ASSETS.AssetsInfoResponse>();
  const [loading, setLoading] = useState<boolean>();
  useEffect(() => {
    setLoading(true);
    const Api = isTask ? getReportsDetailAssetsById : getAssetsById;
    id &&
      Api({ hash_id: id, task_id })
        .then(setInfo)
        .finally(() => setLoading(false));
  }, [id, task_id]);

  const { service, infos, region_name, platform_name, agentless_scannable } =
    info ?? {};
  const isCloudHost = service === 'Cloud Host';
  const _breadcrumb = useMemo(() => {
    return getBreadcrumbs(state as IState) ?? breadcrumb;
  }, [state]);

  const onScanOk = useMemoizedFn(async (params) => {
    try {
      await assetsScan(params as unknown as API.AssetsScanRequest);
      message.success(intl.formatMessage({ id: 'unStand.startScan' }));
      return true;
    } catch (e) {
      console.error(e);
    }
  });

  const ScanRender = useMemo(() => {
    if (!info || !id) {
      return;
    }
    const { agentless_scannable, credential_id } = info ?? {};
    if (agentless_scannable) {
      return (
        <ScanSingleAsset
          onFinish={(vals) => {
            return onScanOk({
              credential_ids: [credential_id],
              instance_hash_ids: [id],
              ...vals,
            });
          }}
        />
      );
    } else {
      return (
        <TzButton
          onClick={(e) => {
            onScanOk({
              scan_types: ['config'],
              credential_ids: [credential_id],
              instance_hash_ids: [id],
            });
          }}
        >
          {intl.formatMessage({ id: 'scan' })}
        </TzButton>
      );
    }
  }, [info]);
  return (
    <TzPageContainer
      header={{
        title: <PageTitle title={info?.instance_name || '-'} />,
        breadcrumb: <PageBreadCrumb items={_breadcrumb} />,
      }}
      extra={[
        !task_id && ScanRender,
        !task_id && (
          <AssetExport
            tip={false}
            fileName={`${info?.instance_name}`}
            assetSearch={[{ platform: info?.platform, instance_id: id }]}
            renderTrigger={
              <TzButton disabled={!info} className="mt-[1px]">
                {intl.formatMessage({ id: 'export' })}
              </TzButton>
            }
          />
        ),
      ]}
    >
      <div className="flex gap-3">
        <AssetInfo className="basis-80" dataSource={info} loading={loading} />
        <div className="flex-1">
          <RelevanceList instance_hash_id={id} />
          {isCloudHost && (
            <>
              <VulnList instance_hash_ids={id} />
              <SensitiveRiskList instance_hash_ids={id} />
            </>
          )}
        </div>
      </div>
    </TzPageContainer>
  );
}

export default memo(Info);
