import EChart from '@/components/EChart';
import NoData from '@/components/NoData';
import { TzCheckboxGroup } from '@/components/lib/tz-checkbox';
import Loading from '@/loading';
import { getStatisticsRisks } from '@/services/cspm/Home';
import { CONFIG_OPT } from '@/utils';
import { useIntl } from '@umijs/max';
import { useMemoizedFn, useSize } from 'ahooks';
import { CheckboxOptionType } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { EChartsOption } from 'echarts';
import { get, max, merge, sortBy, sum, unzip } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import CategoryTabs from '../../components/CategoryTabs';
import { RISKS, RISK_COLORS } from '../../components/Chart/constans';
import {
  CHART_CONFIG,
  getRadius,
  getTooltipPos,
} from '../../components/Chart/util';
import styles from './index.less';

const { grid, axisLabelC, splitLineC } = CHART_CONFIG;

const option: Partial<EChartsOption> = {
  grid: { ...grid, bottom: 4, top: 8 },
  tooltip: {
    className: 'echart-tooltip',
    trigger: 'axis',
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
    axisLabel: {
      color: axisLabelC,
      formatter: '{value}',
    },
    type: 'value',
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

const topR = [3, 3, 0, 0];
function RiskStatisticks() {
  const [options, setOptions] = useState<Partial<EChartsOption>>(option);
  const [category, setCategory] = useState<API.Category>('platform');
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [config, setConfig] = useState<CheckboxValueType[]>([
    'config',
    'agentless',
  ]);
  const boxRef = useRef<HTMLDivElement>(null);
  const { width = 0 } = useSize(boxRef) ?? {};
  const intl = useIntl();

  const transData = useMemoizedFn((data: API.StatisticsRisksResponse[]) => {
    if (!data?.length) {
      setIsEmpty(true);
      return {};
    }
    setIsEmpty(false);

    let all: number[] = [];
    const _data = data?.map(
      ({
        name,
        unified_service_name,
        platform_name,
        CRITICAL = 0,
        HIGH = 0,
        LOW = 0,
        MEDIUM = 0,
        UNKNOWN = 0,
      }) => {
        all.push(sum([CRITICAL, HIGH, LOW, MEDIUM, UNKNOWN]));
        return [
          name,
          unified_service_name,
          platform_name,
          CRITICAL,
          HIGH,
          MEDIUM,
          LOW,
          UNKNOWN,
        ];
      },
    );
    const [names, unified_service_name, platform_name, ...restData] =
      unzip(_data);
    // let interObj = getLeftData(min(all) as number, max(all) as number);

    const mx = Math.ceil((max(all) as number) / 4) * 4;
    return {
      grid: {
        bottom: ['region', 'service'].includes(category) ? -6 : 2,
      },
      tooltip: {
        position: getTooltipPos,
        //   position: function (point, params, dom, rect, size) {
        //     return {
        //       top: 'center',
        //       left:
        //         point[0] > dom.offsetWidth
        //           ? point[0] - dom.offsetWidth
        //           : point[0],
        //     };
        //   },
        formatter: (params: any) => {
          const { unified_service_name, name, platform_name } = get(params, [
            0,
            'data',
          ]);
          const _name =
            category === 'service'
              ? `${unified_service_name}`
              : category === 'platform'
                ? name
                : `${platform_name}-${name}`;

          let str = `<div class='echart-tooltip-content'>
          <div class='echart-tooltip-title'>${_name}</div>`;
          let content = '';
          let sum = 0;

          params?.forEach((item: any, idx: number) => {
            sum += item.data.value;
            content += `<div class='row'>
            <div class="label">
            <span class='marker' style=\"background-color:${RISK_COLORS[idx]};\" ></span> 
            ${item.seriesName}</div>
            <span>${item.data.value}</span></div>`;
          });
          str += `${content}<div class='echart-tooltip-total row'><span class="label">Total</span><span class='num'>${sum}<span></div></div>`;
          return str;
        },
      },
      xAxis: {
        data: category === 'service' ? unified_service_name : names,
        axisLabel: ['region', 'service'].includes(category)
          ? {
              rotate: 30,
              width: 80,
              overflow: 'truncate',
            }
          : undefined,
      },
      // yAxis: {
      //   ...interObj,
      // },

      yAxis: {
        max: mx,
        min: 0,
        interval: mx / 4,
      },
      series: restData.map((v, idx) => ({
        type: 'bar',
        // barWidth: 12,
        barMaxWidth: 30,
        barMinWidth: 2,
        name: RISKS[idx],
        data: v.map((y, itemIdx) => ({
          name: names[itemIdx],
          unified_service_name: unified_service_name[itemIdx],
          noTitle: true,
          value: y,
          platform_name: platform_name[itemIdx],
          itemStyle: {
            borderRadius: getRadius({
              dimensionality: idx,
              index: itemIdx,
              data: restData,
              config: [topR, 0],
            }),
            color: RISK_COLORS[idx],
          },
        })),
        stack: 'x',
      })),
    };
  });
  useEffect(() => {
    if (!config?.length) {
      setIsEmpty(true);
      return;
    }
    setLoading(true);
    getStatisticsRisks({
      category,
      risk_types: config as string[],
    })
      .then((res) => {
        const data = merge({}, option, transData(sortBy(res, 'platform')));
        setOptions(data);
      })
      .finally(() => setLoading(false));
  }, [category, config]);

  return (
    <div className="w-full">
      <div className="mb-2">
        <CategoryTabs
          className="extra-grow"
          tabBarExtraContent={{
            left: (
              <>
                <span className="head-tit-1">
                  {intl.formatMessage({ id: 'riskItemStatistics' })}
                </span>
                <TzCheckboxGroup
                  className="ml-5"
                  options={
                    CONFIG_OPT as Array<CheckboxOptionType | string | number>
                  }
                  value={config}
                  onChange={setConfig}
                />
              </>
            ),
          }}
          onChange={(key) => {
            // chart.current = initChart();
            setCategory(key as API.Category);
          }}
        />
      </div>
      <div ref={boxRef} className="h-[240px]">
        {loading ? (
          <Loading style={{ paddingTop: 8 }} />
        ) : isEmpty ? (
          <NoData />
        ) : (
          <EChart
            style={{ width }}
            key={category}
            className={styles.cart}
            options={options}
          />
        )}
      </div>
    </div>
  );
}
export default RiskStatisticks;
