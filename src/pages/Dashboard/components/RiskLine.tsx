import EChart from '@/components/EChart';
import NoData from '@/components/NoData';
import TzTabs, { TzTabsProps } from '@/components/lib/TzTabs';
import { TzCheckboxGroup } from '@/components/lib/tz-checkbox';
import {
  TzRangePicker,
  TzRangePickerProps,
} from '@/components/lib/tz-range-picker';
import useCredentials from '@/hooks/useCredentials';
import Loading from '@/loading';
import translate from '@/locales/translate';
import CusSelectWithAll from '@/pages/components/CusSelectWithAll';
import { getTendency } from '@/services/cspm/Home';
import { CONFIG_OPT } from '@/utils';
import { useIntl, useLocation } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { CheckboxOptionType } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import dayjs, { Dayjs } from 'dayjs';
import { EChartsOption } from 'echarts';
import { flatten, floor, get, isUndefined, max, merge, min, zip } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { RISKS, RISK_COLORS } from '../../components/Chart/constans';
import { CHART_CONFIG, getLeftData } from '../../components/Chart/util';
import styles from './index.less';

const { grid, axisLabelC, splitLineC } = CHART_CONFIG;
export const DEFAULT_RANGEPICKERP_ROPS: TzRangePickerProps = {
  allowClear: false,
  showTime: true,
  format: 'YYYY/MM/DD HH:mm:ss',
  presets: [
    { label: translate('day1'), value: [dayjs().add(-1, 'd'), dayjs()] },
    { label: translate('day7'), value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: translate('day30'), value: [dayjs().add(-30, 'd'), dayjs()] },
  ],
};
const VALUE_TIME_DAY = 86400000;
const TabItems: TzTabsProps['items'] = [
  {
    key: '1',
    label: translate('day1'),
    children: null,
  },
  {
    key: '7',
    label: translate('day7'),
    children: null,
  },
  {
    key: '30',
    label: translate('day30'),
    children: null,
  },
];

const getTimeSection = (end: number, start: number): string =>
  '' + floor((end - start) / VALUE_TIME_DAY, 2);
type timeSectionProps = {
  start: Dayjs;
  end: Dayjs;
};
const updatedAt: timeSectionProps = {
  start: dayjs().add(-7, 'd'),
  end: dayjs(),
};
const option: EChartsOption = {
  grid: {
    ...grid,
    top: 20,
    bottom: 25,
  },
  toolbox: {
    feature: {
      dataZoom: {
        show: true,
        yAxisIndex: 'none',
        iconStyle: {
          opacity: 0,
        },
      },
    },
  },
  legend: {
    data: RISKS,
    icon: 'circle',
    bottom: 0,
    itemWidth: 8,
    itemHeight: 8,
  },
  color: RISK_COLORS,
  tooltip: {
    className: 'echart-tooltip',
    trigger: 'axis',
    formatter: (params: any) => {
      let sum = 0;
      let str = `<div class='echart-tooltip-content'><div class='echart-tooltip-title'>${dayjs(
        get(params, [0, 'value', 0]),
      ).format('YYYY-MM-DD HH:mm:ss.SSS')}</div>`;

      params.forEach((item: any, idx: number) => {
        sum += item.value[1];
        str += `<div class='row'>
        <div class="label">
        <span class='marker' style=\"background-color:${RISK_COLORS[idx]};\" ></span>
        ${item.seriesName}</div><span>${item.value[1]}</span></div>`;
      });
      str += `<div class='echart-tooltip-total row'><span class="label">Total</span><span class='num'>${sum}<span></div>`;
      return (str += '</div>');
    },
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985',
      },
    },
  },
  xAxis: {
    type: 'category',
    axisPointer: {
      lineStyle: {
        color: 'rgba(33, 119, 209, 0.8)',
        width: 2,
      },
    },
    splitLine: {
      lineStyle: {
        color: splitLineC,
      },
    },
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
  yAxis: [
    {
      type: 'value',
      axisPointer: {
        show: false,
      },
      axisLabel: {
        color: axisLabelC,
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: [splitLineC],
        },
      },
    },
  ],
  series: [],
};
function RiskLine() {
  const intl = useIntl();
  const { key } = useLocation();
  const [options, setOptions] = useState<Partial<EChartsOption>>(option);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [config, setConfig] = useState<CheckboxValueType[]>([
    'config',
    'agentless',
  ]);
  const updatedAt: timeSectionProps = useMemo(
    () => ({
      start: dayjs().add(-7, 'd'),
      end: dayjs(),
    }),
    [key],
  );
  const [activeKey, setActiveKey] = useState(
    getTimeSection(updatedAt.end.valueOf(), updatedAt.start.valueOf()),
  );
  const [filters, setFilters] = useState<
    Pick<API.TendencyRequest, 'credential_ids'> & {
      updatedAt: [timeSectionProps['start'], timeSectionProps['end']];
    }
  >({
    updatedAt: [updatedAt.start, updatedAt.end],
  });
  const account = useCredentials();

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      credential_ids: account?.map((v) => v.value) as string[],
    }));
  }, [account]);

  const transData = useMemoizedFn((data: API.TendencyResponse[]) => {
    if (!data?.length) {
      setIsEmpty(true);
      return {};
    }
    setIsEmpty(false);
    // let names: Date[] = [
    //   1711814776488, 1711900842085, 1711900842127, 1711900842143,
    // ];
    let names: Date[] = [];
    let namesStr: string[] = [];
    let lows: number[] = [];
    let highs: number[] = [];
    let mediums: number[] = [];
    let criticals: number[] = [];
    let unknowns: number[] = [];
    data?.forEach(({ datetime, distribution }) => {
      const {
        HIGH = 0,
        MEDIUM = 0,
        LOW = 0,
        CRITICAL = 0,
        UNKNOWN = 0,
      } = distribution;
      names.push(datetime);
      namesStr.push(dayjs(datetime).format('YYYY-MM-DD HH:mm:ss.SSS'));
      highs.push(HIGH);
      lows.push(LOW);
      mediums.push(MEDIUM);
      criticals.push(CRITICAL);
      unknowns.push(UNKNOWN);
    });
    const seriesData = [criticals, highs, mediums, lows, unknowns];

    const all = flatten(seriesData);
    let interObj = getLeftData(min(all) as number, max(all) as number);

    return {
      xAxis: {
        type: 'time',
        data: names,
        maxInterval: 3600 * 24 * 1000,
      },
      yAxis: {
        ...interObj,
      },
      series: seriesData.map((v, idx) => ({
        name: RISKS[idx],
        type: 'line',
        data: zip(names, seriesData[idx]),
        step: 'end',
        symbol: 'none',
      })),
    };
  });
  useEffect(() => {
    const { updatedAt, credential_ids } = filters;
    if (isUndefined(credential_ids)) {
      setIsEmpty(true);
      return;
    }
    setLoading(true);
    getTendency({
      credential_ids,
      risk_types: config as string[],
      ended_at: +updatedAt[1],
      started_at: +updatedAt[0],
    })
      .then((res) => setOptions(merge({}, option, transData(res))))
      .finally(() => setLoading(false));
  }, [filters, config]);

  const rangePickerProps = useMemo(
    (): TzRangePickerProps => ({
      ...DEFAULT_RANGEPICKERP_ROPS,
      onChange: (e: any) => {
        const end = dayjs(e[1]).valueOf();
        const start = dayjs(e[0]).valueOf();
        setActiveKey(getTimeSection(end, start));
        setFilters((prev) => ({ ...prev, updatedAt: e }));
      },
    }),
    [],
  );

  return (
    <div className={styles.tendencyItem}>
      <div>
        <TzTabs
          activeKey={activeKey}
          className="with-tit"
          tabBarExtraContent={
            <div className="flex items-center">
              <span className="head-tit-1">
                {intl.formatMessage({ id: 'riskTrendChart' })}
              </span>
              <span className="ml-3">
                {intl.formatMessage({ id: 'cloudAccountLabel' })}：
              </span>
              <CusSelectWithAll
                onChange={(val: any) => {
                  setFilters((prev) => ({
                    ...prev,
                    credential_ids: val ?? [],
                  }));
                }}
                placeholder={intl.formatMessage(
                  { id: 'selectTips' },
                  { name: '' },
                )}
                value={filters.credential_ids}
                options={account}
                allLabel={intl.formatMessage({ id: 'fullAccount' })}
                bordered={false}
                size="small"
                className="min-w-[120px] -ml-[10px]"
                popupMatchSelectWidth={200}
              />

              <TzCheckboxGroup
                className="ml-5"
                options={
                  CONFIG_OPT as Array<CheckboxOptionType | string | number>
                }
                value={config}
                onChange={setConfig}
              />
            </div>
          }
          items={TabItems}
          onChange={(e) => {
            setActiveKey(e);
            setFilters((prev) => ({
              ...prev,
              updatedAt: [dayjs().add(-parseInt(e), 'd'), dayjs()],
            }));
          }}
        />
      </div>
      <div className="flex justify-end">
        <TzRangePicker
          style={{ width: '360px' }}
          {...rangePickerProps}
          value={filters.updatedAt}
        />
      </div>

      {loading ? (
        <Loading style={{ paddingTop: 8 }} />
      ) : isEmpty ? (
        <NoData />
      ) : (
        <EChart
          finished={(chart: any) => {
            chart.dispatchAction({
              type: 'takeGlobalCursor',
              key: 'dataZoomSelect',
              dataZoomSelectActive: true,
            });
          }}
          className={styles.cart}
          options={options}
          style={{ height: 245 }}
        />
      )}
    </div>
  );
}
export default RiskLine;
