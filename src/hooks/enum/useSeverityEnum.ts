import { RISK_STATUS_MAP } from '@/utils';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { keyBy } from 'lodash';
import { useMemo } from 'react';

export const useSeverityEnum = () => {
  const { commonConst, getTagInfo } = useModel('global') ?? {};
  const { severity } = commonConst ?? {};
  const riskSeverity = useMemo(
    () =>
      severity?.filter((v) =>
        ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(v.value),
      ),
    [severity],
  );
  const riskSeverityEnum = useMemo(
    () =>
      keyBy(
        riskSeverity?.map((v) => ({ ...v, text: v.label, status: v.value })),
        'value',
      ),
    [riskSeverity],
  );
  const severityEnum = useMemo(
    () =>
      keyBy(
        severity?.map((v) => ({ ...v, text: v.label, status: v.value })),
        'value',
      ),
    [severity],
  );
  const vulnerabilitySeverity = useMemo(
    () => severity?.filter((v) => ['HIGH', 'MEDIUM', 'LOW'].includes(v.value)),
    [severity],
  );
  const secretSeverityEnum = useMemo(
    () =>
      keyBy(
        vulnerabilitySeverity?.map((v) => ({
          ...v,
          text: v.label,
          status: v.value,
        })),
        'value',
      ),
    [severity],
  );

  const getSeverityTagInfoByStatus = useMemoizedFn(
    (status: API.PolicySeverity) =>
      getTagInfo(severity, status, RISK_STATUS_MAP),
  );

  return {
    severityOption: severity,
    severityEnum: severityEnum,
    riskSeverityEnum: riskSeverityEnum,
    riskSeverityOption: riskSeverity,
    secretSeverityOption: vulnerabilitySeverity,
    vulnerabilitySeverityOption: vulnerabilitySeverity,
    secretSeverityEnum,
    getSeverityTagInfoByStatus,
  };
};
