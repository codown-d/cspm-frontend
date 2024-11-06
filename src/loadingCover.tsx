import classNames from 'classnames';
import type { CSSProperties, FC } from 'react';
import Loading from './loading';

type LoadingCoverProps = {
  className?: string;
  rootClassName?: string;
  style?: CSSProperties;
  loading?: boolean;
};
const LoadingCover: FC<LoadingCoverProps> = ({
  rootClassName,
  className,
  loading,
  style,
}) => {
  return (
    !!loading && (
      <div
        className={classNames(
          'h-full flex items-start justify-center z-10 w-full absolute left-0 bg-gradient-to-b from-white',
          rootClassName,
        )}
        style={{ zIndex: 9999, alignItems: 'flex-start' }}
      >
        <Loading style={{ paddingTop: 8, ...style }} className={className} />
      </div>
    )
  );
};

export default LoadingCover;
