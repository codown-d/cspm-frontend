import { RATIO_OPT_VIEW } from '@/utils';
import classNames from 'classnames';
import RatioIcon from './RatioIcon';

type IPopItem = Pick<API.PeriodicCompareResponse, 'ratio' | 'ratio_type'> & {
  compare_type: string;
  className?: string;
  isPlatform?: boolean;
  is_new?: boolean;
  type?: 'common' | 'growth';
};
function PopItem(props: IPopItem) {
  const {
    compare_type,
    ratio_type,
    isPlatform,
    ratio,
    type,
    is_new,
    className,
  } = props;
  return (
    <div className={className}>
      {type === 'growth' &&
        (is_new ? (
          <div
            className={classNames('inline-block w-[31px] h-1 relative', {
              // 'ml-2': isPlatform,
            })}
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
              {RATIO_OPT_VIEW.find((v) => v.value === compare_type)?.label}
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
}

export default PopItem;
