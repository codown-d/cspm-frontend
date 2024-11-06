import TzTypography from '@/components/lib/TzTypography';
import useTableAnchor from '@/hooks/useTableAnchor';
import STATIS_ICONS from '@/iconMap';
import { TCommonPlatforms } from '@/interface';
import { ZH_LANG } from '@/locales';
import { RATIO_OPT_VIEW, getPlatformItem } from '@/utils';
import { getLocale, useIntl, useModel } from '@umijs/max';
import { useSize } from 'ahooks';
import classNames from 'classnames';
import { get } from 'lodash';
import {
  CSSProperties,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PopItem from './PopItem';
import RatioIcon from './RatioIcon';
import './index.less';

export type TCompareType = 'week' | 'month';
export type TGrowthParam = {
  type: 'growth';
  category: API.Category;
  compare_type: string;
  data: API.PeriodicCompareResponse[];
};
export type TCommonParam = {
  type?: 'common';
  data: API.DashboardCredentialsResponse[];
};
export type BasicStatisticsProps = (TGrowthParam | TCommonParam) & {
  scrollAnchorStyle?: CSSProperties;
  className?: string;
};
type OverviewData = Partial<API.PeriodicCompareResponse> &
  Partial<
    Pick<
      TCommonPlatforms,
      'value' | 'colors' | 'icon' | 'key' | 'name' | 'label'
    >
  >;

const getColumns = (w: number) => {
  if (w > 1920) {
    return 7;
  }
  if (w > 1600) {
    return 6;
  }
  if (w > 1366) {
    return 5;
  }
  return 4;
};

const BasicStatistics = (props: BasicStatisticsProps) => {
  const { type = 'common', data, className, scrollAnchorStyle } = props;
  const intl = useIntl();
  const boxRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const { width: windWidth = 0 } =
    useSize(document.querySelector('body')) ?? {};
  const cols = getColumns(windWidth);
  const hasMoreBtn = useMemo(() => data?.length > 2 * cols, [cols, data]);
  const [fold, setFold] = useState<boolean>();
  const listOffsetFn = useTableAnchor(anchorRef, { behavior: 'smooth' });

  useEffect(() => setFold(hasMoreBtn), [hasMoreBtn]);
  const category = (props as TGrowthParam).category;

  const { height: boxH = 0 } = useSize(boxRef) ?? {};
  const isPlatform = !['region', 'service'].includes(category);

  const [overviewData, setOverviewData] = useState<
    undefined | OverviewData[]
  >();
  const { initialState } = useModel('@@initialState');
  const { commonPlatforms } = initialState ?? {};

  useEffect(() => {
    setOverviewData(
      data?.map(({ platform, ...rest }) => ({
        ...getPlatformItem(platform, commonPlatforms),
        ...rest,
      })),
    );
  }, [data]);

  const isZh = useMemo(() => getLocale() === ZH_LANG, []);

  const SpaceItems = useMemo(
    () =>
      overviewData?.map(
        ({
          colors,
          icon,
          name,
          key,
          value = 0,
          ratio_type,
          ratio,
          icon_name,
          is_new,
          label,
        }) => {
          const map =
            get(STATIS_ICONS, [category, icon_name || '']) ||
            get(STATIS_ICONS, ['region', 'beijing']);
          const [left, top] = isPlatform ? [] : map.pos ?? [];
          const bg = isPlatform ? [] : map.bg ?? [];

          const popItem = (
            <div className="">
              {type === 'growth' &&
                (is_new ? (
                  <div
                    className={classNames(
                      'inline-block w-[31px] h-1 relative',
                      { 'ml-2': isPlatform },
                    )}
                  >
                    <span
                      className="w-full h-full leading-4 text-base text-center absolute left-0 icon iconfont text-[#E95454] icon-new"
                      style={{ top: -8 }}
                    />

                    <span
                      className="w-full h-full text-white text-center absolute left-0 text-[10px]"
                      style={{ top: -10 }}
                    >
                      NEW
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="text-[#6C7480] h-5 inline-flex items-center ">
                      {
                        RATIO_OPT_VIEW.find(
                          (v) =>
                            v.value === (props as TGrowthParam).compare_type,
                        )?.label
                      }
                      {/* {
                    [
                      intl.formatMessage({ id: 'increase' }),
                      intl.formatMessage({ id: 'increase' }),
                      intl.formatMessage({ id: 'decrease' }),
                    ][toNumber(ratio_type)]
                  } */}
                      {ratio_type ? (
                        <span
                          className={classNames({
                            'mr-1': !isPlatform,
                          })}
                        >
                          <RatioIcon ratio_type={ratio_type} />
                        </span>
                      ) : (
                        isPlatform && <>&nbsp;</>
                      )}
                      {ratio_type === '0' ? '' : `${ratio}%`}
                    </div>
                  </>
                ))}
            </div>
          );

          return (
            <div
              className="nav-item-case-abnormal nav-item-case relative"
              style={{
                background: isPlatform
                  ? `linear-gradient(180deg, ${colors?.[0]} 0%, ${colors?.[1]} 100%)`
                  : `linear-gradient(180deg, ${bg?.[0]} 0%, ${bg?.[1]} 100%)`,
              }}
              key={key}
            >
              <div className="flex flex-col content-center w-full z-[2] py-3 px-4">
                <div
                  className={classNames(
                    'text-xl text-[#1e222a] font-medium num',
                  )}
                >
                  {value}
                </div>
                <div
                  className={classNames('leading-5 txt w-full', {
                    // 'flex gap-x-2': isZh,
                  })}
                >
                  <div
                    className={classNames(' w-50', {
                      // 'not-p-row': !isPlatform,
                      // flex: !isPlatform,
                      // 'inline-block': isPlatform,
                      // 'flex-1': isZh,
                    })}
                  >
                    {/* {!isPlatform && (
                      <div className="mt-[1px] mr-1 w-4 h-4 relative inline-block overflow-hidden">
                        <img
                          className="absolute"
                          style={{ top: `-${top}px`, left: `-${left}px` }}
                          src={STATIS_ICONS_IMG}
                        />
                      </div>
                    )} */}

                    {label ? (
                      <TzTypography.Text
                        ellipsis={{
                          tooltip: label,
                          suffix: isZh ? (
                            <PopItem
                              className="inline-block ml-2"
                              {...{
                                ratio_type,
                                isPlatform,
                                ratio,
                                type,
                                is_new,
                              }}
                              compare_type={
                                (props as TGrowthParam).compare_type
                              }
                            />
                          ) : undefined,
                        }}
                      >
                        {label}
                      </TzTypography.Text>
                    ) : (
                      '-'
                    )}
                  </div>
                  {!isZh && (
                    <PopItem
                      {...{
                        ratio_type,
                        isPlatform,
                        ratio,
                        type,
                        is_new,
                      }}
                      compare_type={(props as TGrowthParam).compare_type}
                    />
                  )}
                </div>
              </div>
              <div className="absolute z-[0] overview-p-icon-box">
                <div className="overview-p-icon">
                  <img className="w-full" alt={key} src={icon} />
                </div>
              </div>
            </div>
          );
        },
      ),
    [overviewData],
  );

  const dataByFold = useMemo(
    () => (fold ? SpaceItems?.slice(0, 2 * cols) : SpaceItems),
    [SpaceItems, cols, fold],
  );

  const foldLine = useMemo(() => {
    const rowH = (boxH - 39) / 2;
    const loadMore = (
      <div
        className={classNames(
          'flex items-center justify-center h-5 w-full text-center cursor-pointer text-[#B3BAC6] text-xs hover:text-[#2177d1]',
        )}
        onClick={() => {
          !fold && listOffsetFn();
          setFold((prev) => !prev);
        }}
      >
        <span
          className={classNames(
            'icon iconfont icon-arrow h-4 w-4 mr-1',
            !fold ? 'rotate-180' : '',
          )}
        ></span>
        {intl.formatMessage({ id: fold ? 'unfold' : 'fold' })}
      </div>
    );
    return fold ? (
      <div
        style={{ height: rowH + 20, top: rowH + 27 }}
        className="w-full z-[5] absolute left-0 bg-gradient-to-t from-white flex items-end justify-center"
      >
        {loadMore}
      </div>
    ) : (
      loadMore
    );
  }, [fold, boxH]);
  const cls = useMemo(
    () => classNames('graph-navi-case', type, category),
    [overviewData],
  );
  return (
    <div ref={boxRef} className={classNames('relative', className)}>
      <div
        className="absolute -top-[164px]"
        style={scrollAnchorStyle}
        ref={anchorRef}
      />
      <div className={cls}>{dataByFold}</div>
      {hasMoreBtn && foldLine}
    </div>
  );
};

export default memo(BasicStatistics);
