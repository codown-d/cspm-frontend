import EChart from '@/components/EChart';
import NoData from '@/components/NoData';
import TzTabs, { TzTabsProps } from '@/components/lib/TzTabs';
import { TzCheckboxGroup } from '@/components/lib/tz-checkbox';
import {
  TzRangePicker,
  TzRangePickerProps,
} from '@/components/lib/tz-range-picker';
import { useRiskTypeEnum } from '@/hooks/enum/useRiskTypeEnum';
import Loading from '@/loading';
import translate from '@/locales/translate';
import { getTendency } from '@/services/cspm/Statistics';
import { useIntl, useLocation } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import classNames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import { EChartsOption } from 'echarts';
import {
  flatten,
  floor,
  get,
  isUndefined,
  keys,
  merge,
  random,
  set,
} from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { RISK_LINE_COLORS } from '../../components/Chart/constans';
import { CHART_CONFIG, getYAxis } from '../../components/Chart/util';
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
const mockdata = () => {
  const dims = new Array(8).fill(0).map((_, idx) => `suibian${idx}`);
  return new Array(10).fill(0).map((_, idx) => {
    let obj = {};
    dims.forEach((name) => {
      set(obj, name, random(5, 200));
    });
    return {
      datetime: 1725267698113 + idx * 1000 * 60 * 60,
      distribution: obj,
    };
  });
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
  tooltip: {
    className: 'echart-tooltip',
    trigger: 'axis',
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
  yAxis: {
    type: 'value',
    axisPointer: {
      show: false,
    },
    axisLabel: {
      color: axisLabelC,
      formatter: '{value}',
    },
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: [splitLineC],
      },
    },
  },
  series: [],
};
function RiskLine() {
  const intl = useIntl();
  const { key } = useLocation();
  const [options, setOptions] = useState<Partial<EChartsOption>>(option);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<number[]>();
  const credentialsRef =
    useRef<API_STATISTICS.TendencyResponse['dimensions']>();
  const colorRef = useRef();
  const [config, setConfig] = useState<CheckboxValueType[]>([
    'config',
    'vuln',
    'sensitive',
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
  const [filters, setFilters] = useState<{
    updatedAt: [timeSectionProps['start'], timeSectionProps['end']];
  }>({
    updatedAt: [updatedAt.start, updatedAt.end],
  });

  const getColObj = useMemoizedFn(() => {
    colorRef.current = credentialsRef.current?.reduce((t, v, idx) => {
      set(t, v.name, RISK_LINE_COLORS[idx]);
      return t;
    }, {});
  });

  const transData = useMemoizedFn((res: API_STATISTICS.TendencyResponse) => {
    if (!res) {
      setIsEmpty(true);
      return {};
    }
    const { dimensions, data } = res;
    const _dimensions = dimensions?.map((v) => v.name);
    setIsEmpty(false);
    const all = flatten(
      data?.map((v) => v.distribution?.map((v) => v.value)),
    ) as number[];
    // const mx = Math.ceil(((max(all) / 10) as number) / 4) * 40;
    const { max: mx } = getYAxis(all);
    const source = data.map((v) => {
      return {
        datetime: dayjs(v.datetime).format('YYYY-MM-DD HH:mm:ss.SSS'),
        ...v.distribution?.reduce((t, v) => {
          set(t, v.name, v.value);
          return t;
        }, {}),
      };
    });
    source.shift();
    return {
      grid: {
        ...grid,
        top: 20,
        bottom: 0,
      },
      tooltip: {
        formatter: (params: any) => {
          const { datetime, ...rest } = get(params, [0, 'data']);

          let sum = 0;
          let str = `<div class='echart-tooltip-content'><div class='echart-tooltip-title'>${dayjs(
            datetime,
          ).format('YYYY-MM-DD HH:mm:ss.SSS')}</div>`;

          keys(rest).forEach((key: any, idx: number) => {
            sum += rest[key];
            str += `<div class='row'>
            <div class="label">
            <span class='marker' style=\"background-color:${get(
              colorRef.current,
              [key],
            )};\" ></span>
            ${key}</div><span>${rest[key]}</span></div>`;
          });
          str += `<div class='echart-tooltip-total row'><span class="label">Total</span><span class='num'>${sum}<span></div>`;
          return (str += '</div>');
        },
      },
      xAxis: {
        maxInterval: 3600 * 24 * 1000,
      },
      yAxis: {
        max: mx,
        min: 0,
        interval: mx / 4,
      },
      dataset: {
        dimensions: [{ name: 'datetime', type: 'time' }, ..._dimensions],
        source,
      },
      series: _dimensions?.map((v) => ({
        type: 'line',
        step: 'end',
        symbol: 'none',
        color: get(colorRef.current, [v]),
      })),
    };
  });
  useEffect(() => {
    const { updatedAt } = filters;
    setLoading(true);
    getTendency({
      risk_types: config as string[],
      ended_at: +updatedAt[1],
      started_at: +updatedAt[0],
      credential_ids: credentials,
    })
      .then((res) => {
        if (!credentialsRef.current) {
          credentialsRef.current = res?.dimensions;
          colorRef.current = res?.dimensions?.reduce((t, v, idx) => {
            set(t, v.name, RISK_LINE_COLORS[idx]);
            return t;
          }, {});
        }
        setOptions(merge({}, option, transData(res)));
      })
      .finally(() => setLoading(false));
  }, [filters, config, credentials]);

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

  const credentialsRefIds = credentialsRef.current?.map((v) => v.id);

  const { RiskTypeOption } = useRiskTypeEnum();
  return (
    <div className={classNames(styles.tendencyItem, 'relative mt-6')}>
      <div>
        <TzTabs
          activeKey={activeKey}
          className="with-tit"
          tabBarExtraContent={{
            right: (
              <>
                <div className="flex items-center">
                  <span className="head-tit-1">
                    {intl.formatMessage({ id: 'riskTrendChart' })}
                  </span>
                  <TzCheckboxGroup
                    className="ml-5"
                    options={RiskTypeOption}
                    value={config}
                    onChange={setConfig}
                  />
                </div>
              </>
            ),
            left: (
              <>
                <TzRangePicker
                  style={{ width: '310px' }}
                  {...rangePickerProps}
                  value={filters.updatedAt}
                />
              </>
            ),
          }}
          //items={TabItems} record/Rf4VrkMIjev2WOcPTsAciX7fnUb
          items={undefined}
          onChange={(e) => {
            setActiveKey(e);
            setFilters((prev) => ({
              ...prev,
              updatedAt: [dayjs().add(-parseInt(e), 'd'), dayjs()],
            }));
          }}
        />
      </div>
      <div className="bg-[rgba(33,119,209,0.02)] relative rounded-lg ">
        {/* <div className="flex justify-end"></div> */}
        <div className="h-[260px]">
          {loading ? (
            <Loading />
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
        <div className="flex gap-x-5 flex-wrap gap-y-2 justify-center pb-[6px]">
          {credentialsRef.current?.map((item, index) => (
            <div
              onClick={() =>
                setCredentials((prev) => {
                  if (isUndefined(prev)) {
                    return credentialsRefIds?.filter((v) => v !== item.id);
                  }
                  return prev.includes(item.id)
                    ? prev.filter((v) => v !== item.id)
                    : [...prev, item.id];
                })
              }
              className={classNames('cursor-pointer', {
                [styles.noActive]: !(
                  credentials ?? credentialsRefIds
                )?.includes(item.id),
              })}
              key={item.id}
            >
              <span
                className="w-2 h-2 rounded inline-block mr-[6px]"
                style={{ background: get(colorRef.current, [item.name]) }}
              ></span>
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default RiskLine;
