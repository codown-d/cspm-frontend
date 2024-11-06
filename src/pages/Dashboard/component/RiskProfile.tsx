import EChart from '@/components/EChart';
import NoData from '@/components/NoData';
import { displayTextWidth } from '@/components/lib/TzFilterForm/utils';
import { useRiskTypeEnum } from '@/hooks/enum/useRiskTypeEnum';
import Loading from '@/loading';
import { getRiskStatistics } from '@/services/cspm/Statistics';
import { history, useIntl, useModel } from '@umijs/max';
import { useMemoizedFn, useSize } from 'ahooks';
import classNames from 'classnames';
import { EChartsOption } from 'echarts';
import { XAXisOption } from 'echarts/types/dist/shared.js';
import { get, keys, max, merge, set, sum, values } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import CategoryTabs from '../../components/CategoryTabs';
import {
  BAR_DEFAULT_CONFIG,
  getEchartProfileConfig,
} from '../../components/Chart/util';
import CompareLine from './CompareLine';
import styles from './index.less';

const option: Partial<EChartsOption> = {
  ...BAR_DEFAULT_CONFIG,
  xAxis: [BAR_DEFAULT_CONFIG.xAxis as XAXisOption],
};
type IRiskStatisticks = {
  // 云平台列表
  platforms?: string[];
};

const RISK_COLORS = {
  config: '#2D94FF',
  vuln: '#7A7DF6',
  sensitive: '#7DD6F6',
};
function RiskStatisticks({ platforms }: IRiskStatisticks) {
  const [options, setOptions] = useState<Partial<EChartsOption>>(option);
  const [category, setCategory] = useState<API_STATISTICS.Category>('platform');
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [dimension, setDimension] =
    useState<API_STATISTICS.CompareType>('week');
  const [risk_types, setRiskTypes] = useState(['config', 'vuln', 'sensitive']);

  const refEchart = useRef();
  const maxLabelVal = useRef<number>();
  const [lineData, setLineData] =
    useState<API_STATISTICS.RiskStatisticsResponse[]>();
  const { initialState } = useModel('@@initialState');
  const { commonPlatforms } = initialState ?? {};
  const dataRef = useRef<API_STATISTICS.RiskStatisticsResponse[]>();
  const boxRef = useRef<HTMLDivElement>(null);
  const { width = 0 } = useSize(boxRef) ?? {};
  const { containerW } = useModel('layout');
  const intl = useIntl();
  const { RiskTypeEnum, RiskTypeOption } = useRiskTypeEnum();

  const maxLabelValW = useMemo(
    () => displayTextWidth(`${maxLabelVal.current}`),
    [options],
  );
  const _w = useMemo(() => {
    const len = lineData?.length;
    return max([(len ?? 0) * 48 + (maxLabelValW ?? 0) + 31, width]);
  }, [width, lineData]);

  const rich = useMemo(() => {
    return commonPlatforms?.reduce((t, v) => {
      set(t, [v.key.replaceAll('-', '')], {
        backgroundColor: {
          image: v.icon,
        },
        height: 16,
      });
      return t;
    }, {});
  }, [commonPlatforms]);
  const transData = useMemoizedFn(
    (data: API_STATISTICS.RiskStatisticsResponse[]) => {
      if (!data?.length) {
        setIsEmpty(true);
        return {};
      }
      setIsEmpty(false);
      setLineData(data);
      let all: number[] = data.map((item) => sum(values(item.value)));
      const { xAxis, yAxis, barWid, axisLabel, grid } = getEchartProfileConfig({
        data,
        category,
        width,
        dataLen: dataRef.current?.length,
        rich,
        all,
      });
      const mx = yAxis.max;
      maxLabelVal.current = mx;
      const source = data.map((v, index) => {
        return {
          key: v.key,
          ...v.value,
          aaa: 0,
          platform_name: v.platform_name,
          platform: v.platform,
          label: v.label,
        };
      });
      const dim = ['config', 'vuln', 'sensitive'];
      return {
        grid: {
          ...grid,
          top: 15,
        },
        tooltip: {
          // position: getTooltipPos,
          formatter: (params: any) => {
            const { key, platform, platform_name, label, aaa, ...restVal } =
              get(params, [0, 'data']);
            const _name = ['platform', 'service'].includes(category)
              ? label
              : `${platform_name}-${label}`;

            let str = `<div class='echart-tooltip-content'>
            <div class='echart-tooltip-title'>${_name}</div>`;
            let content = '';
            let sum = 0;

            keys(restVal)?.forEach((key: any, idx: number) => {
              sum += restVal[key];
              content += `<div class='row'>
              <div class="label">
              <span class='marker' style=\"background-color:${get(
                RISK_COLORS,
                key,
              )};\" ></span>
              ${get(RiskTypeEnum, [key, 'label'])}</div>
              <span>${restVal[key]}</span></div>`;
            });
            str += `${content}<div class='echart-tooltip-total row'><span class="label">Total</span><span class='num'>${sum}<span></div></div>`;
            return str;
          },
        },
        xAxis: [xAxis],
        yAxis,
        axisLabel,
        dataset: {
          dimensions: [
            'key',
            ...dim,
            'aaa',
            { name: 'platform_name', type: 'ordinal' },
            { name: 'platform', type: 'ordinal' },
            { name: 'label', type: 'ordinal' },
          ],
          source,
        },

        series: [
          ...dim.map((v) => ({
            type: 'bar',
            ...barWid,
            stack: 'x',
            color: get(RISK_COLORS, v),
            label: {
              show: true,
              color: '#fff',
              formatter: (params) => {
                const val = get(params, ['value', v]) ?? 0;
                return val > mx / 10 ? val : '';
              },
            },
          })),
          {
            type: 'bar',
            ...barWid,
            stack: 'x',
            // barCategoryGap: '50%',
            color: 'transparent',
            label: {
              show: true,
              color: '#3E4653',
              position: 'top',
              formatter: (params) => {
                const { sensitive, vuln, config } = get(params, 'value');
                return sum([sensitive || 0, vuln || 0, config || 0]);
              },
            },
          },
        ],
      };
    },
  );
  useEffect(() => {
    setLoading(true);
    getRiskStatistics({
      category,
      compare_type: dimension,
      risk_types,
    })
      .then((res) => {
        dataRef.current = res;
        const data = merge({}, option, transData(res));
        setOptions(data);
      })
      .finally(() => setLoading(false));
  }, [category, dimension, risk_types]);

  useEffect(() => refEchart.current?.resize?.(width), [containerW]);

  const onZrClick = useMemoizedFn((idx) => {
    const p = get(dataRef.current, idx);
    history.push(`/asset/list`, {
      category,
      key: get(p, 'key'),
      platform: get(p, 'platform'),
      from: 'dashboard',
      risk_types,
    });
  });

  return (
    <div ref={boxRef}>
      <div className="flex justify-between flex-wrap">
        <div>
          <span className="head-tit-1">
            {intl.formatMessage({ id: 'riskProfile' })}
          </span>
          <div className="inline-flex gap-5 ml-5 mr-[20px]">
            {RiskTypeOption?.map((item) => (
              <div
                onClick={() =>
                  setRiskTypes((prev) =>
                    prev.includes(item.value)
                      ? prev.filter((v) => v !== item.value)
                      : [...prev, item.value],
                  )
                }
                className={classNames(styles.riskType, styles[item.value], {
                  [styles.noActive]: !risk_types.includes(item.value),
                })}
                key={item.value}
              >
                {item.label as string}
              </div>
            ))}
          </div>
        </div>
        <CategoryTabs
          onChange={(key) => {
            setCategory(key as API_STATISTICS.Category);
          }}
        />
      </div>
      <div className="bg-[rgba(33,119,209,0.02)] rounded-lg h-[278px]">
        {loading ? (
          <Loading />
        ) : isEmpty ? (
          <NoData className="pt-4" />
        ) : (
          <div
            className="overflow-x-auto overflow-y-hidden"
            style={{
              width: width || '100%',
            }}
          >
            <div
              className="relative"
              style={{
                width: _w,
              }}
            >
              {/* <LoadingCover loading={loading} /> */}
              <CompareLine
                data={lineData}
                dimension={dimension}
                setDimension={setDimension}
                isOverflow={width < (_w ?? 0)}
                left={(maxLabelValW ?? 0) + 20}
              />
              <div className="h-[178px] relative">
                <EChart
                  ref={refEchart}
                  style={{ width: _w }}
                  key={category}
                  className={styles.cart}
                  options={options}
                  onZrClick={onZrClick}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default RiskStatisticks;
