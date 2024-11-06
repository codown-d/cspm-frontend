import { TzCol, TzRow } from '@/components/lib/tz-row-col';
import { IAssetStatisticks } from '@/pages/components/Chart/AssetStatisticks';
import RiskStatisticks from '@/pages/components/Chart/RiskStatisticks';
import TopRisk from '@/pages/components/Chart/TopRisk';
import { useIntl } from '@umijs/max';
import { memo } from 'react';
import styles from './index.less';

function RiskCharts(props: IAssetStatisticks) {
  const intl = useIntl();
  return (
    <div className={styles.riskCharts}>
      <TzRow gutter={38} style={{ minHeight: 220 }}>
        <TzCol span={12} className={styles.riskStatisticks}>
          <RiskStatisticks {...props} />
        </TzCol>
        <TzCol span={12}>
          <TopRisk
            platforms={props.platforms}
            isConfig
            title={intl.formatMessage({ id: 'topRisk' })}
          />
        </TzCol>
      </TzRow>
    </div>
  );
}

export default memo(RiskCharts);
