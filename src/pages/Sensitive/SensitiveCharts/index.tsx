import { TzCol, TzRow } from '@/components/lib/tz-row-col';
import Sensitive from '@/pages/Dashboard/component/Sensitive';
import TopRisk from '@/pages/Vuln/VulnCharts/TopRisk';
import { getSensitiveAssetsTop } from '@/services/cspm/Agentless';
import { useIntl } from '@umijs/max';
import { memo } from 'react';
import styles from './index.less';

type IRiskCharts = {
  platforms?: string[];
};
function RiskCharts({ platforms }: IRiskCharts) {
  const intl = useIntl();
  return (
    <div className={styles.riskCharts}>
      <TzRow gutter={44} style={{ minHeight: 208 }}>
        <TzCol span={12} className={styles.riskStatisticks}>
          <Sensitive
            platforms={platforms}
            className="h-[178px]"
            chartClassName="grid-cols-2 gap-1"
          />
        </TzCol>
        <TzCol span={12}>
          <TopRisk
            type="secret"
            apiUrl={getSensitiveAssetsTop}
            platforms={platforms}
            title={intl.formatMessage({ id: 'topSensitiveAssets' })}
          />
        </TzCol>
      </TzRow>
    </div>
  );
}

export default memo(RiskCharts);
