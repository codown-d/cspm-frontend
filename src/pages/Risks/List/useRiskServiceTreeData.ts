import { getRiskServicetree } from '@/services/cspm/CloudPlatform';
import { useMemoizedFn } from 'ahooks';
import { set } from 'lodash';
import { useEffect } from 'react';
import { useImmer } from 'use-immer';

interface RiskServiceTreeDataParam {
  defaultParam?: { credential_id?: number };
}
function useRiskServiceTreeData(param?: RiskServiceTreeDataParam) {
  const [serviceTree, setServiceTree] = useImmer({
    configServiceTree: undefined,
    vulnServiceTree: undefined,
    sensitiveServiceTree: undefined,
  });

  const refreshRiskServiceTreeData = useMemoizedFn(() => {
    ['config', 'vuln', 'sensitive'].forEach((risk_type) => {
      getRiskServicetree({ risk_type, ...param }).then((res) => {
        setServiceTree((draft) => set(draft, `${risk_type}ServiceTree`, res));
      });
    });
  });
  useEffect(() => {
    refreshRiskServiceTreeData();
  }, [param]);

  return {
    serviceTree,
    refreshRiskServiceTreeData,
  };
}

export default useRiskServiceTreeData;
