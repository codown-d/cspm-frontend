import EChart from '@/components/EChart';
import NoData from '@/components/NoData';
import Loading from '@/loading';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import { EChartsOption } from 'echarts';
import { merge } from 'lodash';
import { useState } from 'react';
const option: Partial<EChartsOption> = {
  tooltip: {
    className: 'echart-tooltip',
    confine: true,
  },
  radar: {
    axisName: {
      color: '#5f6c7a',
    },
    splitNumber: 4,
    axisLine: { lineStyle: { color: 'rgba(0, 0, 0, 0.05)' } },
    splitArea: { areaStyle: { color: ['#fff', 'rgba(0, 0, 0, 0.05)'] } },
    indicator: [],
  },
  series: [
    {
      areaStyle: { color: 'rgba(108, 190, 245, 0.8)' },
      lineStyle: { color: '#2D94FF' },
      symbolSize: 7,
      symbol: 'circle',
      itemStyle: {
        color: '#fff',
        borderColor: '#2D94FF',
        borderWidth: 2,
      },
      type: 'radar',
      data: [],
    },
  ],
};
type RadarProps = {
  title?: string;
  dataSource?: API.VulnRiskInfoResponseAttr[];
};
function Radar({ dataSource, title }: RadarProps) {
  const [options, setOptions] = useState<Partial<EChartsOption>>(option);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const transData = useMemoizedFn((data: API.VulnRiskInfoResponseAttr[]) => {
    if (!data?.length) {
      setIsEmpty(true);
      return {};
    }
    setIsEmpty(false);

    return {
      tooltip: {
        show: true,
        formatter: () => {
          let str = `<div class='echart-tooltip-content'><div class='echart-tooltip-title' >${title}</div>`;
          let content = '';
          data?.forEach((item: any) => {
            content += `<div class='row'><div class="label"><span>${item.name}</span></div>${item.value}</span></div>`;
          });
          str += `${content}</div>`;
          return str;
        },
      },
      radar: {
        indicator: data.map((v) => ({ name: v.name, max: 100 })),
      },
      series: [
        {
          data: [{ value: data.map(({ pos }) => pos) }],
        },
      ],
    };
  });
  useUpdateEffect(() => {
    setOptions(merge({}, option, transData(dataSource)));
    setLoading(false);
  }, [dataSource]);

  return (
    <div className="w-full">
      <div className="h-[240px]">
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
export default Radar;
