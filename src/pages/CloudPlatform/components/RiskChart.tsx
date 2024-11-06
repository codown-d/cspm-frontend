import EChart from '@/components/EChart';
import NoData from '@/components/NoData';
import translate from '@/locales/translate';
import { useIntl } from '@umijs/max';
import classNames from 'classnames';
import { EChartsOption } from 'echarts';
import { merge } from 'lodash';
import { memo, useEffect, useMemo, useState } from 'react';
import styles from './riskChart.less';

export type TAssetsChart = {
  risks?: API.Risks;
};
const option: Partial<EChartsOption> = {
  title: {
    text: '-',
    subtext: translate('riskTotal'),
    textStyle: { fontSize: 32, color: '#3E4653', fontWeight: 600 },
    subtextStyle: { fontSize: 12, color: '#6C7480', fontWeight: 400 },
    top: '38%',
    itemGap: 5,
    left: 'center',
  },
  color: ['#E95454', '#FF8A34', '#FFC423'],
  series: [
    {
      name: translate('riskTotal'),
      type: 'pie',
      radius: ['71.5%', '91.5%'],
      avoidLabelOverlap: false,
      emphasis: {
        disabled: true,
      },
      label: false,
      labelLine: {
        show: false,
      },
      data: [],
    },
  ],
};
let RisksChart = ({ risks }: TAssetsChart) => {
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const { low = undefined, medium = undefined, high = undefined } = risks ?? {};
  const [options, setOptions] = useState<Partial<EChartsOption>>(option);
  const intl = useIntl();

  const items = useMemo(
    () => [
      { name: intl.formatMessage({ id: 'high' }), value: high },
      { name: intl.formatMessage({ id: 'medium' }), value: medium },
      { name: intl.formatMessage({ id: 'low' }), value: low },
    ],
    [risks],
  );
  useEffect(() => {
    // const chart = initChart();
    const _t = low ?? medium ?? high;
    setIsEmpty(false);

    setOptions(
      merge({}, option, {
        title: {
          text:
            _t === undefined ? '-' : (low ?? 0) + (medium ?? 0) + (high ?? 0),
        },
        series: [
          {
            data: items,
          },
        ],
      }),
    );
  }, [items]);

  return (
    <div className="flex justify-end items-center">
      {isEmpty ? (
        <NoData />
      ) : (
        <>
          <EChart
            className={styles.card}
            options={options}
            style={{ width: 240, height: 240 }}
          />
          <div className={styles.riskItemBox}>
            {items.map((v, idx) => (
              <div className={styles.riskItem} key={v.name}>
                <span
                  className={classNames(
                    styles.riskItemLabel,
                    styles[`risk${idx}`],
                  )}
                >
                  {v.name}
                </span>
                <span>{v.value ?? '-'}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default memo(RisksChart);
