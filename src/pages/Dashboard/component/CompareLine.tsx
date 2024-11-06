import TzSelect from '@/components/lib/tzSelect';
import { RATIO_OPT } from '@/utils';
import classNames from 'classnames';
import { memo } from 'react';
import styles from './index.less';
type IProps = {
  data?: API_STATISTICS.RiskStatisticsResponse[];
  dimension?: string;
  left?: number;
  isOverflow?: boolean;
  setDimension: (arg: API_STATISTICS.CompareType) => void;
};
const CompareLine = ({
  data,
  setDimension,
  dimension,
  isOverflow,
  left = 0,
}: IProps) => {
  const len = data?.length ?? 0;

  if (!len) {
    return;
  }
  return (
    <div className={classNames(styles.CompareLine, 'my-5')}>
      <div className="absolute bottom-1/2 translate-y-2/4 -left-8 z-[1]">
        <TzSelect
          showSearch={false}
          onChange={setDimension}
          value={dimension}
          options={RATIO_OPT}
          bordered={false}
          className="min-w-[20px] ml-5"
          // popupMatchSelectWidth={200}
        />
      </div>
      <div
        className={classNames(
          styles.CompareLineBox,
          'h-[60px] grid',
          `grid-flow-col`,
        )}
        style={{
          width: `calc(100% - 16px - ${left}px)`,
          marginLeft: left + 8,
        }}
      >
        {data?.map((item, index) => {
          const { ratio_type, ratio: _ratio, is_new, key } = item;
          const r = +(_ratio ?? 0);
          const ratio = r > 100 ? 100 : r;
          const h =
            ratio_type === '1' ? `${50 + ratio / 2}%` : `${50 - ratio / 2}%`;
          return (
            <div className="relative" key={key}>
              <div
                className={classNames(styles.ratioLine, 'absolute ', {
                  'bottom-1/2': ratio_type === '1' || is_new,
                  'top-1/2': !is_new && ratio_type === '2',
                })}
                style={{
                  // left: is_new ? '54%' : 'calc(50% + 15.5px)',
                  left: 'calc(50% - 0.5px)',
                  height: is_new ? 0 : `${ratio / 2}%`,
                }}
              />
              <div
                className="absolute w-[22px] leading-4 z-[1]"
                // style={{
                //   left: is_new ? '45%' : '50%',
                //   bottom: is_new ? '57%' : ratio_type === '2' ? '-24px' : h,
                // }}
                style={{
                  left: 'calc(50% - 11px)',
                  bottom: is_new
                    ? '57%'
                    : ratio_type === '2'
                      ? `calc(${h} - 25px)`
                      : h,
                }}
              >
                {is_new ? (
                  <div
                    className={classNames(
                      'w-[26px] text-[#fff] bg-[#E95454] rounded-[3px] text-[9px] h-4 text-center',
                      // {
                      //   '-translate-x-1': len > 20,
                      //   'translate-x-1': len < 20,
                      // },
                    )}
                  >
                    NEW
                  </div>
                ) : (
                  <>
                    {ratio_type === '2' ? (
                      <div className="flex flex-col items-center mb-[4.5px]">
                        <div
                          className={classNames('w-2 h-2 rounded z-[1]', {
                            'bg-[#52C41A]': ratio_type === '2',
                          })}
                        />
                        <div>-{_ratio}%</div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center -mb-[4.5px]">
                        <div>
                          {ratio_type === '0' ? (
                            '--'
                          ) : (
                            <>
                              {['', '+'][+(ratio_type ?? 0)]}
                              {_ratio}%
                            </>
                          )}
                        </div>
                        <div
                          className={classNames('w-2 h-2 rounded z-[1]', {
                            'bg-[#E95454]': ratio_type === '1',
                            'bg-[#D7DBE2]': ratio_type === '0',
                          })}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(CompareLine);
