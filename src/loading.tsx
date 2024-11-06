import LoadingLottie from '@/components/LoadingLottie';
import classNames from 'classnames';
import type { CSSProperties, FC } from 'react';

type LoadingProps = {
  className?: string;
  style?: CSSProperties;
};
const Loading: FC<LoadingProps> = ({ className, style }) => {
  return (
    <div
      className={classNames(
        'tz-loading w-full pt-32 flex flex-col justify-center items-center',
        className,
      )}
      style={style}
    >
      {/* <img
        src={`${PUBLIC_URL}/lighthouse.gif`}
        alt="loading"
        style={{ width: '100px', height: '100px' }}
      /> */}
      {/* <div className="page-loading">
        <FormattedMessage id="loading" />
      </div> */}
      <div style={{ width: '140px', height: '140px' }}>
        <LoadingLottie />
      </div>
    </div>
  );
};

export default Loading;
