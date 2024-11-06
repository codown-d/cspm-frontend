import EChart from '@/components/EChart';
import echarts from '@/components/EChart/echarts.config';
import NoData from '@/components/NoData';
import TzTabs, { TzTabsProps } from '@/components/lib/TzTabs';
import { useRiskTypeEnum } from '@/hooks/enum/useRiskTypeEnum';
import LoadingCover from '@/loadingCover';
import { getTopRisks } from '@/services/cspm/Home';
import { history, useIntl } from '@umijs/max';
import { useMemoizedFn, useSize, useUpdateEffect } from 'ahooks';
import classNames from 'classnames';
import { EChartsOption } from 'echarts';
import { get, keys, max, merge } from 'lodash';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { RISKTABKEYS } from './constans';
import { CHART_CONFIG } from './util';
type TopRiskProps = {
  className?: string;
  title?: string;
  isConfig?: boolean;
  noAxis?: boolean;
  isAllPlatforms?: boolean;
  width?: number;
  platforms?: string[];
};

export const TabItems: TzTabsProps['items'] = keys(RISKTABKEYS).map((key) => ({
  key,
  label: RISKTABKEYS?.[key as API.RiskTypeCategory],
  children: null,
}));
const { axisLabelC, splitLineC, grid } = CHART_CONFIG;
const option: Partial<EChartsOption> = {
  grid: {
    ...grid,
    left: 10,
    right: 10,
    top: 0,
    bottom: 0,
    containLabel: false,
  },
  tooltip: {
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
      lineHeight: 20,
      inside: true,
    },
    axisPointer: {
      type: 'shadow',
      shadowStyle: {
        color: 'rgba(33,119,209,0.05)',
      },
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },
  xAxis: {
    show: false,
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
  const { isConfig, platforms, isAllPlatforms, className } = props ?? {};
  const intl = useIntl();
  const boxRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<API.TopRisksResponse[]>();
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<Partial<EChartsOption>>(option);
  const { width = 0 } = useSize(boxRef) ?? {};
  const prevW = useRef(width);
  const [category, setCategory] = useState<API.RiskTypeCategory>('config');

  const { RiskTypeOption } = useRiskTypeEnum();
  const RiskTypeTabOption = useMemo(
    () =>
      RiskTypeOption?.map((v) => ({
        key: v.value,
        label: v.label,
        children: null,
      })),
    [RiskTypeOption],
  );
  const transData = useMemoizedFn((res: API.TopRisksResponse[]) => {
    if (!res?.length) {
      setIsEmpty(true);
      return {};
    }
    setIsEmpty(false);
    prevW.current = width;
    const data = res.map((v) => ({ name: v.label, value: v.value }));

    return {
      tooltip: {
        formatter: (params: any) => {
          let str = `<div class='echart-tooltip-content'>`;
          const { name, value } = get(params, [0, 'data']);
          str += `<div class='row'>
              <div class="label">
              <span class='marker' style=\"background-color:#2177D1;\" ></span>
              ${name}</div><span>${value}</span></div>`;
          return (str += '</div>');
        },
      },
      yAxis: {
        inverse: true,
        data: merge([], Array.from({ length: 5 }), data)?.map(
          (v?: API.TopRisksResponse) => (!v ? '' : v.name),
        ),
        axisLabel: {
          width: width - 60,
          overflow: 'truncate',
          interval: 0,
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
    if (!isAllPlatforms && !platforms?.length) {
      setIsEmpty(true);
      return;
    }
    // const fetchApi = isAssets ? getTopAssetsRisks : getTopRisks;
    setLoading(true);
    getTopRisks({
      platforms,
      risk_type: category,
    })
      .then((res) => {
        dataRef.current = res;
        setOptions(merge({}, option, transData(res)));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [platforms, category]);

  const onZrClick = useMemoizedFn((idx) => {
    const { key, policy_type, entity_type } = get(dataRef.current, idx) ?? {};
    if (category === 'config') {
      history.push(`/risks/info/${key}`, {
        policy_type,
        entity_type,
        status: 'unpassed',
      });
    }
    if (category === 'sensitive') {
      history.push(`/secret/info/${key}`);
    }
    if (category === 'vuln') {
      history.push(`/vuln/info/${key}`);
    }
  });
  return (
    <div className={classNames('w-full relative', className)}>
      <div className="mb-2">
        {!isConfig ? (
          <TzTabs
            className="with-tit"
            tabBarExtraContent={
              <span className="head-tit-1 ml-[10px]">
                {intl.formatMessage({ id: 'topRisk' })}
              </span>
            }
            activeKey={category}
            items={RiskTypeTabOption}
            onChange={(key) => {
              setCategory(key as API.RiskTypeCategory);
            }}
          />
        ) : (
          <span className="head-tit-1 ml-[10px]">
            {intl.formatMessage({ id: 'topRisk' })}
          </span>
        )}
      </div>
      <div className="chart-content relative">
        <LoadingCover loading={loading} />
        <div ref={boxRef} className="h-[195px] chart-box -mb-[17px]">
          {isEmpty ? (
            <NoData />
          ) : (
            <EChart ZrDataInY onZrClick={onZrClick} options={options} />
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(TopRisk);
