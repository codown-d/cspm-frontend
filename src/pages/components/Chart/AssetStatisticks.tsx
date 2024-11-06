import EChart from '@/components/EChart';
import echarts from '@/components/EChart/echarts.config';
import NoData from '@/components/NoData';
import LoadingCover from '@/loadingCover';
import { getStatisticsAssets } from '@/services/cspm/Home';
import { useIntl } from '@umijs/max';
import { useControllableValue, useMemoizedFn, useSize } from 'ahooks';
import { EChartsOption } from 'echarts';
import { get, indexOf, max, merge } from 'lodash';
import {
  Dispatch,
  Key,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import CategoryTabs from '../CategoryTabs';
import styles from './index.less';
import { BAR_DEFAULT_CONFIG, RISK_BAR_COLORS, getYAxis } from './util';
export type IAssetStatisticks = {
  platforms?: string[];
  value?: API.Category;
  onChange?: Dispatch<SetStateAction<API.Category>>;
  drillId?: Key;
  setDrillId?: (arg?: Key) => void;
};
function AssetStatisticks({
  platforms,
  value,
  onChange,
  drillId,
  setDrillId,
}: IAssetStatisticks) {
  const [options, setOptions] =
    useState<Partial<EChartsOption>>(BAR_DEFAULT_CONFIG);

  const boxRef = useRef<HTMLDivElement>(null);
  const { width = 0 } = useSize(boxRef) ?? {};

  const [category, setCategory] = useControllableValue<API.Category>({
    value: value ?? 'platform',
    onChange,
  });

  const dataRef = useRef<API.StatisticsAssetsResponse[]>();
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const intl = useIntl();

  const transData = useMemoizedFn(
    (data: API_STATISTICS.RiskStatisticsResponse[]) => {
      if (!data?.length) {
        setIsEmpty(true);
        return {};
      }
      setIsEmpty(false);

      // if (category === 'region') {
      //   return transDataByRegion(data);
      // }

      const all = data.map((v) => v.value) as number[];

      const lw = (width ?? 0) / (data?.length || 1);
      const maxL = max([lw - 20, 80]);

      return {
        grid: {
          top: 8,
          bottom: ['region', 'service'].includes(category) ? -6 : 2,
        },
        tooltip: {
          formatter: (params: any) => {
            const { label, platform_name } = get(params, [0, 'data']);
            let str = `<div class='echart-tooltip-content'>`;
            let content = '';
            const _name = ['platform', 'service'].includes(category)
              ? label
              : `${platform_name}-${label}`;

            params?.forEach((item: any) => {
              content += `<div class='row'><div class="label"><span class='marker' style=\"background-color:#2D94FF;\"></span> <span>${_name}</span></div>${item.value}</span></div>`;
            });
            str += `${content}</div>`;
            return str;
          },
        },
        xAxis: {
          data: data.map((v) => v['label']),
          axisLabel: ['region', 'service'].includes(category)
            ? {
                rotate: 30,
                width: 80,
                overflow: 'truncate',
              }
            : { width: maxL, interval: 0, overflow: 'truncate' },
        },
        yAxis: getYAxis(all),
        series: [
          {
            type: 'bar',
            barMaxWidth: 30,
            barMinWidth: 2,
            data: data.map((v) => {
              const colorIdx = indexOf(platforms, v.platform) ?? 0;
              return {
                ...v,
                itemStyle:
                  category === 'region'
                    ? {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                          { offset: 0, color: RISK_BAR_COLORS[colorIdx][0] },
                          { offset: 1, color: RISK_BAR_COLORS[colorIdx][1] },
                        ]),
                      }
                    : {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                          { offset: 0, color: '#2D94FF' },
                          { offset: 1, color: '#2177D1' },
                        ]),
                      },
              };
            }),
          },
        ],
      };
    },
  );
  const setData2Echarts = useMemoizedFn((res) => {
    const data = merge({}, BAR_DEFAULT_CONFIG, transData(res));
    setOptions(data);
  });

  useEffect(() => {
    setLoading(true);
    getStatisticsAssets({ category, platforms })
      .then((res) => {
        dataRef.current = res;
        setData2Echarts(res?.filter((v) => !drillId || `${v.key}` === drillId));
      })
      .finally(() => setLoading(false));
  }, [category, platforms, drillId]);

  const onZrClick = useMemoizedFn(
    (idx) => !drillId && setDrillId?.(get(dataRef.current, [idx, 'key'])),
  );

  return (
    <div className="w-full">
      <div className="mb-2 flex flex-wrap justify-between">
        <span className="head-tit-1">
          {intl.formatMessage({ id: 'assetsStatistics' })}
        </span>
        <CategoryTabs
          activeKey={category}
          className="extra-grow"
          onTabClick={() => setDrillId?.(undefined)}
          onChange={(key) => {
            setCategory(key as API.Category);
          }}
        />
      </div>
      <div className="h-[178px] relative" ref={boxRef}>
        <LoadingCover loading={loading} />
        {isEmpty ? (
          <NoData />
        ) : (
          <EChart
            onZrClick={onZrClick}
            className={styles.cart}
            options={options}
          />
        )}
      </div>
    </div>
  );
}
export default AssetStatisticks;
