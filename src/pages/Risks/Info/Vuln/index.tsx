import useBreadcrumb from '@/hooks/useBreadcrumb';
import { getVulnRisksById } from '@/services/cspm/CloudPlatform';
import { useLocation, useParams } from '@umijs/max';
import { ItemType } from 'antd/lib/breadcrumb/Breadcrumb';
import { useEffect, useState } from 'react';
import WrapperInfo from '../WrapperInfo';
import Info from './Info';
import RiskAssetsList from './RiskAssetsList';

type TState = API.SensitiveRisksDatum & {
  task_id?: number;
  infoBreadcrumb?: ItemType[];
};
function VulnInfo() {
  const { id } = useParams();
  const { state } = useLocation();

  const { task_id, infoBreadcrumb } = (state as TState) ?? {};
  const curBreadcrumb = useBreadcrumb(infoBreadcrumb);
  const [info, setInfo] = useState<API.VulnRiskInfoResponse>();
  const [loading, setLoading] = useState<boolean>();

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
    <WrapperInfo info={info} infoBreadcrumbName="vulnInfo">
      <Info dataSource={info} loading={loading} />
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
    </WrapperInfo>
  );
}

export default VulnInfo;
