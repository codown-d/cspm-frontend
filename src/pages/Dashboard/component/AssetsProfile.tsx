import EChart from '@/components/EChart';
import echarts from '@/components/EChart/echarts.config';
import NoData from '@/components/NoData';
import { displayTextWidth } from '@/components/lib/TzFilterForm/utils';
import Loading from '@/loading';
import { getAssetsStatistics } from '@/services/cspm/Statistics';
import { history, useIntl, useModel } from '@umijs/max';
import { useMemoizedFn, useSize } from 'ahooks';
import { EChartsOption } from 'echarts';
import { get, indexOf, max, merge, set, union } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import CategoryTabs from '../../components/CategoryTabs';
import {
  BAR_DEFAULT_CONFIG,
  RISK_BAR_COLORS,
  getEchartProfileConfig,
} from '../../components/Chart/util';
import CompareLine from './CompareLine';
import styles from './index.less';

function AssetsProfile() {
  const [options, setOptions] =
    useState<Partial<EChartsOption>>(BAR_DEFAULT_CONFIG);
  const [category, setCategory] = useState<API_STATISTICS.Category>('platform');
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [dimension, setDimension] =
    useState<API_STATISTICS.CompareType>('week');
  const refEchart = useRef();
  const [lineData, setLineData] =
    useState<API_STATISTICS.RiskStatisticsResponse[]>();
  const { initialState } = useModel('@@initialState');
  const { commonPlatforms } = initialState ?? {};
  const dataRef = useRef<API_STATISTICS.RiskStatisticsResponse[]>();

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

  const boxRef = useRef<HTMLDivElement>(null);
  const { width = 0 } = useSize(boxRef) ?? {};
  const { containerW } = useModel('layout');
  const intl = useIntl();
  const maxLabelVal = useRef<number>();

  const maxLabelValW = useMemo(
    () => displayTextWidth(`${maxLabelVal.current}`),
    [options],
  );

  const _w = useMemo(() => {
    const len = lineData?.length;
    return max([(len ?? 0) * 48 + (maxLabelValW ?? 0) + 31, width]);
  }, [width, lineData]);
  const getPIndex = (platform?: string) =>
    indexOf(union(dataRef.current?.map((v) => v.platform)), platform) ?? 0;
  const transData = useMemoizedFn(
    (data: API_STATISTICS.RiskStatisticsResponse[]) => {
      if (!data?.length) {
        setIsEmpty(true);
        return {};
      }
      setIsEmpty(false);
      setLineData(data);
      const { xAxis, yAxis, barWid, axisLabel, grid } = getEchartProfileConfig({
        data,
        category,
        width,
        dataLen: dataRef.current?.length,
        rich,
        all: data.map((v) => v.value),
      });

      // let interObj = getLeftData(min(all) as number, max(all) as number);
      maxLabelVal.current = yAxis.max;

      const source = data.map((v, index) => {
        return {
          key: v.key,
          value: v.value,
          platform_name: v.platform_name,
          platform: v.platform,
          label: v.label,
        };
      });
      return {
        grid,
        tooltip: {
          formatter: (params: any) => {
            const { label, value, platform_name } = get(params, [0, 'data']);
            const { marker } = get(params, 0);

            const _name = ['platform', 'service'].includes(category)
              ? label
              : `${platform_name}-${label}`;

            let str = `<div class='echart-tooltip-content'>`;
            let content = '';
            params?.forEach((item: any) => {
              content += `<div class='row'><div class="label"><span class='marker-region'>${marker}</span></span> <span>${_name}</span></div>${value}</span></div>`;
            });
            str += `${content}</div>`;
            return str;
          },
        },
        xAxis,
        yAxis,
        axisLabel,
        dataset: {
          dimensions: [
            'key',
            'value',
            { name: 'platform_name', type: 'ordinal' },
            { name: 'platform', type: 'ordinal' },
            { name: 'label', type: 'ordinal' },
          ],
          source,
        },
        series: [
          {
            type: 'bar',
            ...barWid,
            encode: {
              tooltip: [1, 3, 4],
            },
            itemStyle: {
              color: (params: Object) => {
                if (['platform', 'credential', 'service'].includes(category)) {
                  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#2D94FF' },
                    { offset: 1, color: '#2177D1' },
                  ]);
                }
                const colorIdx = getPIndex(get(params, 'data.platform'));
                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: RISK_BAR_COLORS[colorIdx][0] },
                  { offset: 1, color: RISK_BAR_COLORS[colorIdx][1] },
                ]);
              },
            },
            label: {
              show: true,
              color: '#fff',
              formatter: (params) => {
                const val = get(params, ['value', 'value']) ?? 0;
                return val > maxLabelVal.current / 10 ? val : '';
              },
            },
          },
        ],
      };
    },
  );
  useEffect(() => {
    setLoading(true);
    getAssetsStatistics({
      category,
      compare_type: dimension,
    })
      .then((res) => {
        dataRef.current = res;
        const data = merge({}, BAR_DEFAULT_CONFIG, transData(res));
        setOptions(data);
      })
      .finally(() => setLoading(false));
  }, [category, dimension]);

  useEffect(() => {
    refEchart.current?.resize?.(width);
  }, [containerW]);
  const onZrClick = useMemoizedFn((idx) => {
    const p = get(dataRef.current, idx);
    history.push(`/asset/list`, {
      category,
      key: get(p, 'key'),
      platform: get(p, 'platform'),
      from: 'dashboard',
    });
  });

  return (
    <div ref={boxRef} className="mt-6">
      <div>
        <CategoryTabs
          className="extra-grow"
          tabBarExtraContent={{
            left: (
              <>
                <span className="head-tit-1">
                  {intl.formatMessage({ id: 'assetProfile' })}
                </span>
              </>
            ),
          }}
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
            className="overflow-x-auto"
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
                left={(maxLabelValW ?? 0) + 20}
                isOverflow={width < (_w ?? 0)}
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
export default AssetsProfile;
