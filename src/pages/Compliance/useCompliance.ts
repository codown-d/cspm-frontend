import useCredentials from '@/hooks/useCredentials';
import useEffectivePlatform from '@/hooks/useEffectivePlatform';
import { getComplianceOverview } from '@/services/cspm/Compliance';
import { history, useLocation } from '@umijs/max';
import { useEventListener, useUpdateEffect } from 'ahooks';
import { get, isEqual } from 'lodash';
import { Key, useEffect, useState } from 'react';

type IState = {
  credentialIds?: number[];
  complianceId?: Key;
};
function useCompliance() {
  const { state } = useLocation();
  const { credentialIds: stateCredentialIds, complianceId: stateComplianceId } =
    (state as IState) ?? {};
  const credentials = useCredentials();
  const [credentialIds, setCredentialIds] = useState<number[]>();
  const [complianceId, setComplianceId] = useState<Key | undefined>(
    stateComplianceId,
  );
  const effectivePlatform = useEffectivePlatform('user');
  const [overviewLoading, setOverviewLoading] = useState<boolean>(false);
  const [complianceOverview, setComplianceOverview] =
    useState<API_COMPLIANCE.ComplianceOverviewItem[]>();

  useEffect(() => {
    setCredentialIds(
      stateCredentialIds ?? credentials?.map((item) => item.value),
    );
  }, [credentials]);

  const l = useLocation();
  useUpdateEffect(() => {
    if (!credentialIds?.length) {
      setComplianceOverview(undefined);
      setComplianceId?.(undefined);
      return;
    }
    getComplianceOverview(credentialIds).then((res) => {
      const prev = complianceOverview?.map((v) => `${v.key}_${v.updated_at}`);
      const cur = res?.map((v) => `${v.key}_${v.updated_at}`);
      if (!isEqual(prev, cur)) {
        setComplianceOverview(undefined);
        setComplianceId(undefined);
        setTimeout(() => {
          setComplianceOverview(res);
          setComplianceId?.(stateComplianceId ?? get(res, [0, 'key']));
        });
      }
    });
  }, [l]);
  const { pathname } = l;

  useEventListener('beforeunload', (event) => {
    if (window.location.hash === '#/compliance/list') {
      // event.preventDefault();
      history.replace(pathname, {
        state: null, // 清除 state
      });
    }
  });

  useEffect(() => {
    if (!credentialIds?.length) {
      setComplianceOverview(undefined);
      setComplianceId?.(undefined);
      return;
    }
    setOverviewLoading(true);
    setComplianceId?.(undefined);

    getComplianceOverview(credentialIds)
      .then((res) => {
        setComplianceOverview(res);
        setComplianceId?.(stateComplianceId ?? get(res, [0, 'key']));
      })
      .finally(() => {
        setOverviewLoading(false);
      });
  }, [credentialIds]);
  return {
    credentials,
    effectivePlatform,
    complianceId,
    setComplianceId,
    credentialIds,
    setCredentialIds,
    complianceOverview,
    overviewLoading,
  };
}

export default useCompliance;
