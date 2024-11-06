import useBreadcrumb from '@/hooks/useBreadcrumb';
import { getRuleSensitiveById } from '@/services/cspm/CloudPlatform';
import { useLocation, useParams } from '@umijs/max';
import { ItemType } from 'antd/lib/breadcrumb/Breadcrumb';
import { useEffect, useState } from 'react';
import WrapperInfo from '../WrapperInfo';
import RiskAssetsList from './RiskAssetsList';

type TState = API.SensitiveRisksDatum & {
  task_id?: number;
  infoBreadcrumb?: ItemType[];
};
function RuleSensitiveInfo() {
  const { id } = useParams();
  const { state } = useLocation() ?? {};
  const { task_id, infoBreadcrumb } = (state as TState) ?? {};

  const curBreadcrumb = useBreadcrumb(infoBreadcrumb);
  const [info, setInfo] = useState<API.RuleSensitiveInfoResponse>();

  useEffect(() => {
    if (!id) {
      return;
    }
    getRuleSensitiveById(id).then(setInfo);
  }, [id]);

  return (
    <WrapperInfo
      info={info ? { ...info, name: info?.title } : undefined}
      infoBreadcrumbName="sensitiveInfo"
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
        defaultParams={{
          sensitive_rule_unique_id: id,
          task_id,
        }}
        isHistory={!!task_id}
      />
    </WrapperInfo>
  );
}

export default RuleSensitiveInfo;
