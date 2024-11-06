import EChart from '@/components/EChart';
import NoData from '@/components/NoData';
import translate from '@/locales/translate';
import { useIntl } from '@umijs/max';
import { EChartsOption } from 'echarts';
import { merge } from 'lodash';
import { memo, useEffect, useState } from 'react';

export type TAssetsChart = {
  coverage?: number;
};
const option: Partial<EChartsOption> = {
  series: [
    {
      type: 'gauge',
      axisLine: {
        lineStyle: {
          width: 12,
          color: [
            [0, 'rgba(33, 119, 209, 1)'],
            [1, '#f4f6fa'],
          ],
        },
      },
      radius: '96%',
      itemStyle: {
        color: 'rgba(33, 119, 209, 0)',
      },
      progress: {
        show: true,
      },
      pointer: {
        width: 6,
        itemStyle: {
          color: 'rgba(33, 119, 209, 1)',
        },
      },
      axisTick: {
        distance: -10,
        length: 10,
        lineStyle: {
          color: '#E7E9ED',
          width: 1,
        },
      },
      splitLine: {
        distance: -10,
        length: 10,
        lineStyle: {
          color: '#fff',
          width: 1,
        },
      },
      axisLabel: {
        color: '#6C7480',
        distance: 16,
        fontSize: 12,
      },
      anchor: {
        show: true,
        showAbove: true,
        size: 8,
        itemStyle: {
          borderWidth: 2,
          borderColor: 'rgba(33, 119, 209, 1)',
        },
      },
      detail: {
        valueAnimation: true,
        formatter: function (value: any) {
          return '{value|' + value.toFixed(0) + '}{unit|%}';
        },
        rich: {
          value: {
            fontSize: 32,
            fontWeight: 'bolder',
            color: '#3E4653',
          },
          unit: {
            fontSize: 12,
            color: '#3E4653',
            fontWeight: 'bolder',
            padding: [0, 0, -6, 4],
          },
        },
        color: '#3E4653',
        fontSize: 12,
        offsetCenter: [0, '52%'],
      },
      title: {
        offsetCenter: [0, '76%'],
        color: '#6C7480',
        fontSize: 12,
      },
      data: [
        {
          value: 0,
          name: translate('scannedAssets'),
        },
      ],
    },
  ],
};
const AssetsChart = ({ coverage }: TAssetsChart) => {
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [options, setOptions] = useState<Partial<EChartsOption>>(option);
  const intl = useIntl();
  useEffect(() => {
    if (!coverage) {
      setIsEmpty(true);
      return;
    }
    setIsEmpty(false);

    setOptions((prev) =>
      merge({}, option, {
        series: [
          {
            data: [
              {
                value: coverage,
                name: intl.formatMessage({ id: 'scannedAssets' }),
              },
            ],
            axisLine: {
              lineStyle: {
                color: [
                  [coverage / 100, 'rgba(33, 119, 209, 1)'],
                  [1, '#f4f6fa'],
                ],
              },
            },
          },
        ],
      }),
    );
  }, [coverage]);

  return (
    <div className="w-full mt-3">
      {isEmpty ? (
        <NoData />
      ) : (
        <EChart className="cart" options={options} style={{ height: 240 }} />
      )}
    </div>
  );
};

export default memo(AssetsChart);
