import { TzCol, TzRow } from '@/components/lib/tz-row-col';
import Vuln from '@/pages/Dashboard/component/Vuln';
import { useIntl } from '@umijs/max';
import { memo } from 'react';
import TopRisk from './TopRisk';
import styles from './index.less';

type IRiskCharts = {
  platforms?: string[];
};
function RiskCharts({ platforms }: IRiskCharts) {
  const intl = useIntl();
  return (
    <div className={styles.riskCharts}>
      <TzRow gutter={48} style={{ minHeight: 208 }}>
        <TzCol span={12} className={styles.riskStatisticks}>
          <Vuln
            platforms={platforms}
            className="h-[178px]"
            chartClassName="grid-cols-2 gap-1"
          />
        </TzCol>
        <TzCol span={12}>
          <TopRisk
            platforms={platforms}
            title={intl.formatMessage({ id: 'topVulnAssets' })}
          />
        </TzCol>
      </TzRow>
    </div>
  );
}

export default memo(RiskCharts);
