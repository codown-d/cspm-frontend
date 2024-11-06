import NoData from '@/components/NoData';
import TzSegmented from '@/components/lib/TzSegmented';
import { TzCheckboxGroup } from '@/components/lib/tz-checkbox';
import LoadingCover from '@/loadingCover';
import { CONFIG_OPT, RATIO_OPT } from '@/utils';
import { useIntl } from '@umijs/max';
import { CheckboxOptionType } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { SegmentedValue } from 'antd/lib/segmented';
import classNames from 'classnames';
import {
  CSSProperties,
  ReactNode,
  memo,
  useEffect,
  useMemo,
  useState,
} from 'react';
import CategoryTabs from '../CategoryTabs';
import { TabItemsWithPAssetType } from '../Chart/util';
import BasicStatistics, {
  TCommonParam,
  TCompareType,
  TGrowthParam,
} from './Basic';
import styles from './GrowthStatics.less';

export type TGrowthStatics = {
  defaultParams?: {
    credential_id?: number;
    task_id?: string;
  };
  title?: ReactNode;
  fetchUrl: Function;
  showRiskType?: boolean;
  className?: string;
  scheduleType?: API_TASK.ScheduleType;
  scrollAnchorStyle?: CSSProperties;
  showSegmented?: boolean;
};
function GrowthStatics(props: TGrowthStatics) {
  const {
    defaultParams,
    fetchUrl,
    showRiskType,
    title,
    className,
    scheduleType,
    scrollAnchorStyle,
    showSegmented = true,
  } = props;

  const [options, setOptions] = useState<API.PeriodicCompareResponse[]>();
  const [category, setCategory] = useState<API.Category>('platform');
  const [dimension, setDimension] = useState<SegmentedValue>('week');
  const [loading, setLoading] = useState<boolean>(false);
  const [config, setConfig] = useState<CheckboxValueType[]>([
    'config',
    'vuln',
    'sensitive',
  ]);
  const intl = useIntl();

  useEffect(() => {
    if (!config?.length) {
      setOptions(undefined);
      return;
    }
    setLoading(true);
    fetchUrl({
      category,
      compare_type: showSegmented ? (dimension as string) : undefined,
      ...(showRiskType ? { risk_types: config } : {}),
      ...defaultParams,
    })
      .then((res: API.PeriodicCompareResponse[]) => {
        setOptions(res);
      })
      .finally(() => setLoading(false));
  }, [category, defaultParams, dimension, showRiskType, config, showSegmented]);
  const isManual = scheduleType === 'manual';

  const basicStatisticsProps = useMemo(
    () =>
      isManual
        ? ({
            type: 'common',
            data: options,
          } as TCommonParam)
        : ({
            type: 'growth',
            compare_type: !showSegmented
              ? 'period'
              : (dimension as TCompareType),
            category,
            data: options,
          } as TGrowthParam),
    [options, showSegmented, dimension, category, isManual],
  );

  return (
    <div className={classNames('w-full', styles.riskHk, className)}>
      <div className="head-row !-mb-0 flex justify-between">
        <div className="">
          <span className="head-tit-1">
            {title ?? intl.formatMessage({ id: 'riskProfile' })}
          </span>
          {showRiskType && (
            <TzCheckboxGroup
              className="ml-5"
              options={
                CONFIG_OPT as Array<CheckboxOptionType | string | number>
              }
              value={config}
              onChange={setConfig}
            />
          )}
        </div>
        <CategoryTabs
          className="w-0 flex-1"
          tabBarExtraContent={
            showSegmented && {
              left: (
                <TzSegmented
                  value={dimension}
                  onChange={setDimension}
                  options={RATIO_OPT}
                />
              ),
            }
          }
          onChange={(key) => {
            setCategory(key as API.Category);
          }}
          items={TabItemsWithPAssetType}
        />
      </div>

      <div className="relative bg-[rgba(33,119,209,0.02)] rounded-lg">
        <LoadingCover loading={loading} />
        {!options?.length ? (
          <NoData />
        ) : (
          <BasicStatistics
            {...basicStatisticsProps}
            scrollAnchorStyle={scrollAnchorStyle}
          />
        )}
      </div>
    </div>
  );
}
export default memo(GrowthStatics);
