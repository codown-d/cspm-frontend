import { TzCard } from '@/components/lib/tz-card';
import RelevanceList from '@/pages/Risks/List/RelevanceList';
import SensitiveRiskList from '@/pages/Risks/List/SensitiveRiskList';
import VulnRiskList from '@/pages/Risks/List/VulnRiskList';
import RiskTypeTabs from '@/pages/components/RiskTypeTabs';
import { CONFIG_RISK_STATIC } from '@/utils';
import { useIntl, useLocation, useParams } from '@umijs/max';
import { BreadcrumbProps } from 'antd';
import { useMemo, useRef, useState } from 'react';

type ScanResProps = {
  infoBreadcrumb?: BreadcrumbProps['items'];
};
function ScanRes({ infoBreadcrumb }: ScanResProps) {
  const intl = useIntl();
  const { state } = useLocation();
  const { task_id } = state ?? {};
  const { id } = useParams();
  const [riskType, setRiskType] = useState<CONFIG_RISK_STATIC>(
    CONFIG_RISK_STATIC.config,
  );

  const filterToRef = useRef<HTMLDivElement>(null);
  const ListDom = useMemo(() => {
    switch (riskType) {
      case CONFIG_RISK_STATIC.config:
        return RelevanceList;
      case CONFIG_RISK_STATIC.sensitive:
        return SensitiveRiskList;
      case CONFIG_RISK_STATIC.vuln:
        return VulnRiskList;
      default:
        return null;
    }
  }, [riskType]);
  return (
    <TzCard
      headStyle={{ paddingBottom: 8 }}
      bodyStyle={{ padding: '4px 16px 16px 16px' }}
      className="is-descriptions"
      title={intl.formatMessage({ id: 'detectionRisksRes' })}
      extra={<div ref={filterToRef} />}
    >
      <RiskTypeTabs onChange={(v) => setRiskType(v as CONFIG_RISK_STATIC)} />
      {!!ListDom && (
        <ListDom
          defaultParams={{ instance_hash_id: id, task_id }}
          infoBreadcrumb={infoBreadcrumb}
          isScanRes
          filterToRef={filterToRef}
        />
      )}
    </TzCard>
  );
}

export default ScanRes;
