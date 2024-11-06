import EChart from '@/components/EChart';
import NoData from '@/components/NoData';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import Loading from '@/loading';
import { getStatisticsRisks } from '@/services/cspm/Home';
import { useIntl } from '@umijs/max';
import { useControllableValue, useMemoizedFn, useSize } from 'ahooks';
import { EChartsOption } from 'echarts';
import { get, max, merge, sum, unzip } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import CategoryTabs from '../../components/CategoryTabs';
import {
  BAR_DEFAULT_CONFIG,
  getRadius,
  getYAxis,
} from '../../components/Chart/util';
import { IAssetStatisticks } from './AssetStatisticks';
import { RISKS, RISK_COLORS } from './constans';
import styles from './index.less';

const topR = [3, 3, 0, 0];
function RiskStatisticks({
  platforms,
  value,
  onChange,
  drillId,
  setDrillId,
}: IAssetStatisticks) {
  const [options, setOptions] =
    useState<Partial<EChartsOption>>(BAR_DEFAULT_CONFIG);
  const [category, setCategory] = useControllableValue<API.Category>({
    value: value ?? 'platform',
    onChange,
  });
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const dataRef = useRef<API.StatisticsRisksResponse[]>();
  const boxRef = useRef<HTMLDivElement>(null);
  const { width = 0 } = useSize(boxRef) ?? {};
  const intl = useIntl();
  const { riskSeverityEnum } = useSeverityEnum();

  const transData = useMemoizedFn((data: API.StatisticsRisksResponse[]) => {
    if (!data?.length) {
      setIsEmpty(true);
      return {};
    }
    setIsEmpty(false);

    let all: number[] = [];
    const _data = data?.map(({ label, platform_name, value }) => {
      const { CRITICAL = 0, HIGH = 0, LOW = 0, MEDIUM = 0 } = value ?? {};
      all.push(sum([CRITICAL, HIGH, LOW, MEDIUM]));
      return [label, platform_name, CRITICAL, HIGH, MEDIUM, LOW];
    });
    const [names, platform_name, ...restData] = unzip(_data);

    const lw = (width ?? 0) / (data?.length || 1);
    const maxL = max([lw - 20, 80]);

    return {
      grid: {
        top: 8,
        bottom: ['region', 'service'].includes(category) ? -6 : 2,
      },
      tooltip: {
        // position: getTooltipPos,
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
          const { name, platform_name } = get(params, [0, 'data']);
          const _name = ['platform', 'service'].includes(category)
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
            <span class='marker' style=\"background-color:${
              RISK_COLORS[idx]
            };\" ></span> 
            ${get(riskSeverityEnum, [item.seriesName, 'label'])}</div>
            <span>${item.data.value}</span></div>`;
          });
          str += `${content}<div class='echart-tooltip-total row'><span class="label">Total</span><span class='num'>${sum}<span></div></div>`;
          return str;
        },
      },
      xAxis: {
        data: names,
        axisLabel: ['region', 'service'].includes(category)
          ? {
              rotate: 30,
              width: 80,
              overflow: 'truncate',
            }
          : { width: maxL, interval: 0, overflow: 'truncate' },
      },
      yAxis: getYAxis(all),
      series: restData.map((v, idx) => ({
        cursor: ['region', 'service'].includes(category)
          ? 'not-allowed'
          : 'pointer',
        type: 'bar',
        barMaxWidth: 30,
        barMinWidth: 2,
        name: RISKS[idx],
        data: v.map((y, itemIdx) => ({
          name: names[itemIdx],
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
  const setData2Echarts = useMemoizedFn((res) => {
    const data = merge({}, BAR_DEFAULT_CONFIG, transData(res));
    setOptions(data);
  });

  useEffect(() => {
    if (!platforms?.length) {
      setIsEmpty(true);
      return;
    }
    setLoading(true);
    getStatisticsRisks({
      category,
      platforms,
    })
      .then((res) => {
        dataRef.current = res;
        setData2Echarts(res?.filter((v) => !drillId || `${v.key}` === drillId));
      })
      .finally(() => setLoading(false));
  }, [category, platforms, drillId]);

  const onZrClick = useMemoizedFn(
    (idx) =>
      !['region', 'service'].includes(category) &&
      !drillId &&
      setDrillId?.(get(dataRef.current, [idx, 'key'])),
  );

  return (
    <div className="w-full">
      <div className="mb-2 flex flex-wrap justify-between">
        <span className="head-tit-1">
          {intl.formatMessage({ id: 'riskConfigStatistics' })}
        </span>
        <CategoryTabs
          activeKey={category}
          className="extra-grow"
          onTabClick={() => setDrillId?.(undefined)}
          // tabBarExtraContent={{
          //   left: (
          //     <>
          //       <span className="head-tit-1">
          //         {intl.formatMessage({ id: 'riskConfigStatistics' })}
          //       </span>
          //     </>
          //   ),
          // }}
          onChange={(key) => {
            setCategory(key as API.Category);
          }}
        />
      </div>
      <div ref={boxRef} className="h-[178px] relative">
        {/* <LoadingCover loading={loading} /> */}
        {loading ? (
          <Loading className="!pt-2" />
        ) : isEmpty ? (
          <NoData />
        ) : (
          <EChart
            onZrClick={onZrClick}
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
