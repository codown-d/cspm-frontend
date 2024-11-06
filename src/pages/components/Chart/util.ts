import { TzTabsProps } from '@/components/lib/TzTabs';
import { EChartsOption } from 'echarts';
import { GridOption } from 'echarts/types/dist/shared';
import { get, keys, max, sum } from 'lodash';
import { TABKEYS, TABKEYS1 } from './constans';

export const TabItems: TzTabsProps['items'] = keys(TABKEYS).map((key) => ({
  key,
  label: TABKEYS?.[key as API.Category],
  children: null,
}));

export const TabItemsWithPAssetType: TzTabsProps['items'] = keys(TABKEYS1).map(
  (key) => ({
    key,
    label: TABKEYS1?.[key as API.Category],
    children: null,
  }),
);

export const getLeftData = (minNUm: number, maxNUm: number) => {
  // 控制分隔条数，
  const diff = (maxNUm - minNUm) / 5;
  const _min = (diff > 0 ? max([minNUm - diff, 0]) : 0) as number;
  return {
    max: maxNUm + diff,
    min: _min,
    // 分割成5等份
    interval: (maxNUm + diff - _min) / 4,
  };
};
export type ChartConfigProps = {
  axisLabelC: string;
  splitLineC: string;
  grid: GridOption;
  barSmallWidth: number;
  barSmallHWidth: number;
  barWidth: number;
};
export const RISK_BAR_COLORS = [
  ['#D8E1FE', '#5C82E5'],
  ['#D0FCFF', '#7BE1E9'],
  ['#DAD8FF', '#A09BFF'],
  ['#FFD8DC', '#FF969F'],
  ['#C2E0FE', '#53A6FF'],
  ['#FCF0FF', '#F3C7FF'],
  ['#FFF1EB', '#FFB675'],
  ['#FFF9E4', '#FFD954'],
  ['#E7FDF8', '#59F3CE'],
  ['#EBFAFF', '#75DEFF'],
  ['#FFF0F8', '#FF99D0'],
];
export const CHART_CONFIG: ChartConfigProps = {
  axisLabelC: '#6C7480',
  splitLineC: '#E7E9ED',
  grid: {
    bottom: 10,
    left: '3%',
    right: '3%',
    top: 10,
    containLabel: true,
  },
  barSmallHWidth: 4,
  barSmallWidth: 10,
  barWidth: 16,
};
export const BAR_DEFAULT_CONFIG: Partial<EChartsOption> = {
  grid: {
    bottom: 10,
    left: '3%',
    right: '3%',
    top: 10,
    containLabel: true,
  },
  tooltip: {
    className: 'echart-tooltip',
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    textStyle: {
      color: CHART_CONFIG.axisLabelC,
    },
    confine: true,
  },
  xAxis: {
    type: 'category',
    axisLabel: {
      color: CHART_CONFIG.axisLabelC,
    },
    axisTick: {
      show: false,
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: CHART_CONFIG.splitLineC,
      },
    },
  },
  yAxis: {
    axisLabel: {
      color: CHART_CONFIG.axisLabelC,
      formatter: '{value}',
    },
    type: 'value',
    splitLine: {
      show: true,
      lineStyle: {
        color: CHART_CONFIG.splitLineC,
        type: 'dashed',
      },
    },
    axisTick: {
      show: false,
    },
  },
  series: [],
};
export const getYAxis = (all: number[]) => {
  const _max = max(all);
  const n = _max > 80 ? 10 : _max > 10 ? 5 : 1;
  const mx = Math.ceil(((max(all) / n) as number) / 4) * 4 * n;
  return {
    max: mx,
    min: 0,
    interval: mx / 4,
  };
};
export const getEchartProfileConfig = (p) => {
  const { data, category, width, dataLen, rich, all } = p;
  const lw = (width ?? 0) / (data?.length || 1);
  const maxL = max([lw - 20, 80]);

  const barWid =
    (dataLen || 1) * 43 > width
      ? { barWidth: 32, barGap: '70%' }
      : { barMaxWidth: 40, barMinWidth: 20, barCategoryGap: '50%' };

  return {
    grid: {
      left: 20,
      right: 10,
      top: 8,
      bottom: ['region', 'service'].includes(category) ? -6 : 2,
    },
    barWid,
    axisLabel: {
      formatter: (_, index) => {
        const platform = get(data, [index, 'platform']);
        const label = get(data, [index, 'label']);
        if (['platform', 'credential'].includes(category)) {
          return (
            '{' + platform.replaceAll('-', '') + '| } {value|' + label + '}'
          );
        }
        return label;
      },

      rich: {
        value: {
          align: 'center',
        },
        ...rich,
      },
    },
    xAxis: {
      nameTruncate: { maxWidth: 200 },
      axisLabel: ['region', 'service'].includes(category)
        ? {
            rotate: 30,
            width: 80,
            interval: 0,
            overflow: 'truncate',
          }
        : { width: maxL, interval: 0, overflow: 'truncate' },
    },
    yAxis: getYAxis(all),
  };
};
export function getTooltipPos(point, params, dom, rect, size) {
  // 获取可视区域的宽度和高度
  const viewWidth = size.viewSize[0];
  const viewHeight = size.viewSize[1];

  // 获取提示框内容的宽度和高度
  const tooltipWidth = dom.offsetWidth;
  const tooltipHeight = dom.offsetHeight;

  // 设置提示框的位置
  let left = point[0] + 10;
  let top = point[1] + 10;

  // 判断提示框是否超出可视范围，如果超出则调整位置
  if (left + tooltipWidth > viewWidth) {
    left = viewWidth - tooltipWidth;
  }
  if (top + tooltipHeight > viewHeight) {
    top = viewHeight - tooltipHeight;
  }

  return [left, top];
}
export function checkEmpty(orgList, preOrg, curOrg) {
  if (preOrg == undefined) {
    return orgList.indexOf(curOrg);
  } else {
    return orgList.indexOf(curOrg) - orgList.indexOf(preOrg) - 1;
  }
}
type TRadius = {
  dimensionality: number;
  index: number;
  data: any;
  config: [number | number[], number | number[]];
};
export const getRadius = ({ dimensionality, index, data, config }: TRadius) => {
  const [r1, r2] = config;

  const len = data.length;
  if (!len) {
    return 0;
  }

  const prevSum =
    dimensionality === 0
      ? 0
      : sum(
          Array.from(new Array(dimensionality).keys()).map(
            (v) => get(data, [v, index]) ?? 0,
          ),
        );
  const nextSum =
    dimensionality === len - 1
      ? 0
      : sum(
          Array.from(new Array(len - dimensionality).keys()).map(
            (v) => get(data, [dimensionality + v + 1, index]) ?? 0,
          ),
        );

  if (prevSum === 0 && nextSum === 0) {
    return 3;
  }
  if (prevSum > 0 && nextSum > 0) {
    return 0;
  }
  if (prevSum > 0) {
    return r1;
  }
  return r2;
};
