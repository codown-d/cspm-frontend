import EChart from '@/components/EChart';
import echarts from '@/components/EChart/echarts.config';
import NoData from '@/components/NoData';
import TzTabs from '@/components/lib/TzTabs';
import Loading from '@/loading';
import { getStatisticsAssets } from '@/services/cspm/Home';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { EChartsOption } from 'echarts';
import { ceil, indexOf, max, merge, min, sortBy, uniq, unzip } from 'lodash';
import { useEffect, useState } from 'react';
import {
  CHART_CONFIG,
  TabItems,
  getLeftData,
} from '../../components/Chart/util';
import styles from './index.less';
const RISK_COLORS = [
  ['#D8E1FE', '#5C82E5'],
  ['#D0FCFF', '#7BE1E9'],
  ['#DAD8FF', '#A09BFF'],
  ['#FFD8DC', '#FF969F'],
  ['#C2E0FE', '#53A6FF'],
  ['#FCF0FF', '#F3C7FF'],
];
const { grid, axisLabelC, splitLineC } = CHART_CONFIG;
const option: Partial<EChartsOption> = {
  grid: { ...grid, top: 8 },
  tooltip: {
    className: 'echart-tooltip',
    // trigger: 'item',
    axisPointer: {
      type: 'shadow',
    },
    textStyle: {
      color: axisLabelC,
    },
    confine: true,
  },
  xAxis: {
    type: 'category',
    axisLabel: {
      color: axisLabelC,
    },
    axisTick: {
      show: false,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: splitLineC,
      },
    },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      color: axisLabelC,
      interval: 'auto',
      formatter: function (value: number) {
        return ceil(value);
      },
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: splitLineC,
        type: 'dashed',
      },
    },
    axisTick: {
      show: false,
    },
  },
  series: [],
};
function AssetStatisticks() {
  const [options, setOptions] = useState<Partial<EChartsOption>>(option);
  const [category, setCategory] = useState<API.Category>('platform');
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const intl = useIntl();

  const transData = useMemoizedFn((data: API.StatisticsAssetsResponse[]) => {
    if (!data?.length) {
      setIsEmpty(true);
      return {};
    }
    setIsEmpty(false);

    if (category === 'region') {
      return transDataByRegion(
        data.map((v) => ({
          ...v,
          name: v.name || intl.formatMessage({ id: 'global' }),
        })),
      );
    }

    const all: number[] = data.map((v) => v.value || 0);
    let interObj = getLeftData(min(all) as number, max(all) as number);

    return {
      grid: {
        bottom: category === 'service' ? -6 : 2,
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          let str = `<div class='echart-tooltip-content'>`;
          let content = '';
          params?.forEach((item: any) => {
            content += `<div class='row'><div class="label"><span class='marker' style=\"background-color:#2D94FF;\"></span> <span>${item.axisValueLabel}</span></div>${item.value}</span></div>`;
          });
          str += `${content}</div>`;
          return str;
        },
      },
      xAxis: {
        data: data.map(
          (v) => v[category === 'service' ? 'unified_service_name' : 'name'],
        ),
        axisLabel:
          category === 'service'
            ? {
                rotate: 30,
                width: 80,
                overflow: 'truncate',
              }
            : undefined,
      },
      yAxis: {
        ...interObj,
      },
      series: [
        {
          type: 'bar',
          barMaxWidth: 30,
          barMinWidth: 2,
          data,
          itemStyle: {
            borderRadius: [3, 3, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2D94FF' },
              { offset: 1, color: '#2177D1' },
            ]),
          },
        },
      ],
    };
  });
  const transDataByRegion = useMemoizedFn(
    (data: API.StatisticsAssetsResponse[]) => {
      let all: number[] = [];
      const _data = data?.map(({ value = 0, platform, name }) => {
        all.push(+value);
        return [platform, name];
      });
      const [p, names] = unzip(_data);

      const platforms = uniq(p) as string[];

      let interObj = getLeftData(min(all) as number, max(all) as number);
      return {
        grid: {
          bottom: -6,
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow',
          },
          ...interObj,
          formatter: (params: any) => {
            const {
              marker,
              data: { platform_name, value, name },
            } = params;

            let str = `<div class='echart-tooltip-content'>`;
            let content = '';

            content += `<div class='row'><div class="label"><span class='marker-region'>${marker}</span><span>${name}</span></div><span>${value}</span></div>`;

            str += `<div class='echart-tooltip-title'>${platform_name}</div>`;
            str += `${content}</div>`;
            return str;
          },
        },
        xAxis: {
          data: names,
          axisLabel: {
            rotate: 30,
            width: 80,
            overflow: 'truncate',
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: axisLabelC,
            interval: 'auto',
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: splitLineC,
              type: 'dashed',
            },
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            type: 'bar',
            barMaxWidth: 30,
            barMinWidth: 2,
            data: data.map((v) => {
              const colorIdx = indexOf(platforms, v.platform);
              return {
                ...v,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: RISK_COLORS[colorIdx][0] },
                    { offset: 1, color: RISK_COLORS[colorIdx][1] },
                  ]),
                },
              };
            }),
            itemStyle: {
              borderRadius: [3, 3, 0, 0],
            },
          },
        ],
      };
    },
  );
  useEffect(() => {
    setLoading(true);
    getStatisticsAssets(category)
      .then((res) => {
        setOptions(merge({}, option, transData(sortBy(res, 'platform'))));
      })
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="w-full">
      <div className="mb-4">
        <TzTabs
          className="with-tit"
          tabBarExtraContent={
            <span className="head-tit-1">
              {intl.formatMessage({ id: 'assetsStatistics' })}
            </span>
          }
          activeKey={category}
          items={TabItems}
          onChange={(key) => {
            setCategory(key as API.Category);
          }}
        />
      </div>
      <div className="h-[240px]">
        {loading ? (
          <Loading style={{ paddingTop: 8 }} />
        ) : isEmpty ? (
          <NoData />
        ) : (
          <EChart className={styles.cart} options={options} />
        )}
      </div>
    </div>
  );
}
export default AssetStatisticks;
