import EChart from '@/components/EChart';
import NoData from '@/components/NoData';
import { TzCheckboxGroup } from '@/components/lib/tz-checkbox';
import Loading from '@/loading';
import { getTopCredentials } from '@/services/cspm/Home';
import { CONFIG_OPT } from '@/utils';
import { useIntl } from '@umijs/max';
import { useMemoizedFn, useSize, useUpdateEffect } from 'ahooks';
import { CheckboxOptionType } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { EChartsOption } from 'echarts';
import { get, max, merge, unzip } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { RISKS, RISK_COLORS } from '../../components/Chart/constans';
import { CHART_CONFIG, getRadius } from '../../components/Chart/util';
type TopRiskProps = {
  platform?: string;
  title?: string;
};
const { axisLabelC, splitLineC, barSmallHWidth, grid } = CHART_CONFIG;
const option: Partial<EChartsOption> = {
  grid: {
    ...grid,
    left: 10,
    right: 10,
    bottom: 0,
    top: '2%',
  },
  tooltip: {
    className: 'echart-tooltip',
    trigger: 'axis',
    confine: true,
    axisPointer: {
      type: 'none',
    },
    formatter: (params: any) => {
      let sum = 0;
      let str = `<div class='echart-tooltip-content'><div class='echart-tooltip-title' >${get(
        params,
        [0, 'axisValueLabel'],
      )}</div>`;
      params.forEach((item: any, idx: number) => {
        sum += item.value;
        str += `<div class='row'>
    <div class="label">
    <span class='marker' style=\"background-color:${
      RISK_COLORS[idx]
    };\" ></span>
    ${RISKS[idx]}</div><span>${item.value ?? 0}</span></div>`;
      });

      str += `<div class='echart-tooltip-total row'><span class="label">Total</span><span class='num'>${sum}<span></div></div></div>`;
      return str;
    },
  },
  yAxis: {
    type: 'category',
    axisLabel: {
      padding: [0, 20, 0, 0],
      margin: 0,
      color: axisLabelC,
      verticalAlign: 'bottom',
      lineHeight: 30,
      inside: true,
      overflow: 'truncate',
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },
  xAxis: {
    axisLabel: {
      color: axisLabelC,
    },
    type: 'value',
    splitLine: {
      show: false,
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
  series: [],
};
const rightR = [0, 3, 3, 0];
const leftR = [3, 0, 0, 3];

function TopRiskPlatform(props?: TopRiskProps) {
  const { platform, title } = props ?? {};
  const [options, setOptions] = useState<Partial<EChartsOption>>(option);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [config, setConfig] = useState<CheckboxValueType[]>([
    'config',
    'agentless',
  ]);
  const boxRef = useRef<HTMLDivElement>(null);
  const { width = 0 } = useSize(boxRef) ?? {};
  const intl = useIntl();

  useEffect(() => {
    if (!config?.length) {
      setIsEmpty(true);
      return;
    }
    setLoading(true);
    getTopCredentials(config as string[])
      .then((res) => setOptions(merge({}, option, transData(res))))
      .finally(() => setLoading(false));
  }, [config]);

  const transData = useMemoizedFn(
    (data: API.StatisticsRisksPlatformResponse[]) => {
      if (!data?.length) {
        setIsEmpty(true);
        return {};
      }
      setIsEmpty(false);
      let all: number[] = [];
      const _data = data?.map(
        ({ credential_name, platform_name, severity_count }) => {
          const {
            UNKNOWN = 0,
            CRITICAL = 0,
            HIGH = 0,
            LOW = 0,
            MEDIUM = 0,
          } = severity_count || {};
          all.push(HIGH + LOW + MEDIUM + UNKNOWN + CRITICAL);
          return [
            `${credential_name} / ${platform_name}`,
            CRITICAL,
            HIGH,
            MEDIUM,
            LOW,
            UNKNOWN,
          ];
        },
      );
      const [names, ...restData] = unzip(_data);

      return {
        yAxis: {
          inverse: true,
          data: merge(
            [],
            Array.from({ length: 5 }).map(() => ''),
            names,
          ),
          axisLabel: {
            width: width - 60,
            overflow: 'truncate',
          },
        },
        series: restData.map((v, idx) => ({
          type: 'bar',
          barWidth: barSmallHWidth,
          showBackground: true,
          backgroundStyle: {
            color: '#F4F6FA',
            borderRadius: 3,
          },
          label: {
            width: 200,
            position: [width - 20, -16],
            color: axisLabelC,
            show: idx === 0,
            align: 'right',
            formatter: (x) => x.data.all,
          },
          name: RISKS[idx],
          data: v.map((y, itemIdx) => ({
            name: names[itemIdx],
            value: y,
            all: all[itemIdx],
            itemStyle: {
              borderRadius: getRadius({
                dimensionality: idx,
                index: itemIdx,
                data: restData,
                config: [rightR, leftR],
              }),
              color: RISK_COLORS[idx],
            },
          })),
          stack: 'x',
        })),
      };
    },
  );

  useUpdateEffect(() => {
    setOptions((prev) =>
      merge({}, prev, {
        yAxis: {
          axisLabel: {
            width: width - 200,
          },
        },
        series: [
          {
            label: {
              position: [max([width - 20, 0]), -16],
            },
          },
        ],
      }),
    );
  }, [width]);

  return (
    <div className=" w-full ">
      <div className="mb-4">
        <span className="head-tit-1">
          {title ?? intl.formatMessage({ id: 'topCloudAccount' })}
        </span>
        <TzCheckboxGroup
          className="ml-5"
          options={CONFIG_OPT as Array<CheckboxOptionType | string | number>}
          onChange={setConfig}
          value={config}
        />
      </div>
      <div ref={boxRef} className="h-[240px]">
        {loading ? (
          <Loading style={{ paddingTop: 8 }} />
        ) : isEmpty ? (
          <NoData />
        ) : (
          <EChart options={options} />
        )}
      </div>
    </div>
  );
}

export default TopRiskPlatform;
