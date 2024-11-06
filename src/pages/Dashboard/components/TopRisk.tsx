import EChart from '@/components/EChart';
import echarts from '@/components/EChart/echarts.config';
import NoData from '@/components/NoData';
import { TzCheckboxGroup } from '@/components/lib/tz-checkbox';
import { getTopAssetsRisks, getTopRisks } from '@/services/cspm/Home';
import { CONFIG_OPT } from '@/utils';
import { useIntl } from '@umijs/max';
import { useMemoizedFn, useSize, useUpdateEffect } from 'ahooks';
import { CheckboxOptionType } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { EChartsOption } from 'echarts';
import { get, max, merge } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { CHART_CONFIG } from '../../components/Chart/util';
type TopRiskProps = {
  title?: string;
  isAssets?: boolean;
  width?: number;
};
const { axisLabelC, splitLineC, grid } = CHART_CONFIG;
const option: Partial<EChartsOption> = {
  grid: {
    ...grid,
    left: 10,
    right: 10,
    bottom: 0,
  },
  tooltip: {
    axisPointer: { type: 'none' },
    className: 'echart-tooltip',
    trigger: 'axis',
    confine: true,
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

  series: [
    {
      type: 'bar',
      stack: 'total',
      showBackground: true,
      backgroundStyle: {
        color: '#F4F6FA',
        borderRadius: 3,
      },
      label: {
        width: 200,
        // position: [width - 20, -16],
        color: axisLabelC,
        show: true,
        align: 'right',
      },
      barWidth: 4,
      itemStyle: {
        borderRadius: 3,
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#2177D1' },
          { offset: 1, color: '#2D94FF' },
        ]),
      },
    },
  ],
};
function TopRisk(props?: TopRiskProps) {
  const { title, isAssets } = props ?? {};
  const intl = useIntl();
  const boxRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [config, setConfig] = useState<CheckboxValueType[]>([
    'config',
    'agentless',
  ]);
  const [options, setOptions] = useState<Partial<EChartsOption>>(option);
  const { width = 0 } = useSize(boxRef) ?? {};
  const prevW = useRef(width);
  const transData = useMemoizedFn((data: API.TopRisksResponse[]) => {
    if (!data?.length) {
      setIsEmpty(true);
      return {};
    }
    setIsEmpty(false);
    prevW.current = width;

    return {
      tooltip: {
        formatter: (params: any) => {
          let str = `<div class='echart-tooltip-content'>`;
          const { service, platform_name, name, value, id, credential_name } =
            get(params, [0, 'data']);
          const _name = isAssets
            ? `${name}(${id || '-'}) / ${service} / ${platform_name}`
            : `${platform_name} / ${service} / ${name}`;
          str += `<div class='row'>
              <div class="label">
              <span class='marker' style=\"background-color:#2177D1;\" ></span>
              ${_name}</div><span>${value}</span></div>`;
          return (str += '</div>');
        },
      },
      yAxis: {
        inverse: true,
        data: merge([], Array.from({ length: 5 }), data)?.map(
          (v?: API.TopRisksResponse) =>
            !v
              ? ''
              : isAssets
                ? `${v.name}(${v.id || '-'}) / ${v.service} / ${
                    v.platform_name
                  }`
                : `${v.platform_name} / ${v.service} / ${v.name}`,
        ),
        axisLabel: {
          width: width - 60,
          overflow: 'truncate',
        },
      },
      series: [
        {
          data,
          label: {
            position: [max([width - 20, 0]), -16],
          },
        },
      ],
    };
  });

  useUpdateEffect(() => {
    if (loading || Math.abs(prevW.current - width) < 5) {
      return;
    }
    prevW.current = width;
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

  useEffect(() => {
    if (!config?.length) {
      setIsEmpty(true);
      return;
    }
    const fetchApi = isAssets ? getTopAssetsRisks : getTopRisks;
    setLoading(true);
    fetchApi(config as string[])
      .then((res) => {
        setOptions(merge({}, option, transData(res)));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [config]);

  return (
    <div className="w-full">
      {/* <Suspense fallback={<Loading style={{ paddingTop: 8 }} />}> */}
      <div className="mb-4">
        <span className="head-tit-1">
          {title ?? intl.formatMessage({ id: 'topRisk' })}
        </span>
        <TzCheckboxGroup
          className="ml-5"
          options={CONFIG_OPT as Array<CheckboxOptionType | string | number>}
          value={config}
          onChange={setConfig}
        />
      </div>
      <div ref={boxRef} className="h-[240px]">
        {isEmpty ? <NoData /> : <EChart options={options} />}
        {/* {loading || !width ? (
          <Loading style={{ paddingTop: 8 }} />
        ) : isEmpty ? (
          <NoData />
        ) : (
          <EChart options={options} />
        )} */}
      </div>
      {/* </Suspense> */}
    </div>
  );
}

export default TopRisk;
