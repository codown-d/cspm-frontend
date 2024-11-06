import { useIntl } from '@umijs/max';
import classNames from 'classnames';
import { memo } from 'react';
import AssetsChart from './AssetsChart';
import RiskChart from './RiskChart';
import styles from './riskChartBar.less';
type TRiskChart = {
  coverage?: number;
  severity?: { [key: string]: any };
};

function RiskChartBar(props: TRiskChart) {
  const { coverage, severity } = props;
  const intl = useIntl();

  return (
    <div className="flex justify-between">
      <div className="flex-1 w-0">
        <div className="card-tit">
          {intl.formatMessage({ id: 'coveredAssetsStatistics' })}
        </div>
        <AssetsChart coverage={coverage} />
      </div>
      {/* <div className="splite bg-[#F4F6FA] w-[1px] h-[196px] mt-12 mr-6 ml-6" /> */}

      <div
        className={classNames('flex-1 w-0 relative', styles.riskStatisticks)}
      >
        <div className="card-tit">
          {intl.formatMessage({ id: 'statisticalRisk' })}
        </div>
        <RiskChart
          risks={{
            high: severity?.['1'],
            medium: severity?.['2'],
            low: severity?.['3'],
          }}
        />
      </div>
    </div>
  );
}

export default memo(RiskChartBar);
