import { TzCol, TzRow } from '@/components/lib/tz-row-col';
// import TopRisk from '@/pages/Dashboard/components/TopRisk';
import AssetStatisticks, {
  IAssetStatisticks,
} from '@/pages/components/Chart/AssetStatisticks';
import TopRisk from '@/pages/components/Chart/TopRisk';
import { useIntl } from '@umijs/max';
import styles from './index.less';

function RiskCharts(props: IAssetStatisticks) {
  const { platforms } = props;
  const intl = useIntl();
  return (
    <div className={styles.riskCharts}>
      <TzRow gutter={38} style={{ minHeight: 220 }}>
        <TzCol span={12} className={styles.riskStatisticks}>
          <AssetStatisticks {...props} />
        </TzCol>
        <TzCol span={12}>
          <TopRisk
            platforms={platforms}
            title={intl.formatMessage({ id: 'topRisk' })}
          />
        </TzCol>
      </TzRow>
    </div>
  );
}

export default RiskCharts;
