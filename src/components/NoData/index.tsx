import noData from '@/assets/images/nodata.png';
import { useIntl } from '@umijs/max';
import classNames from 'classnames';
import './index.less';
export type NoDataProps = {
  small?: boolean;
  size?: 'small' | 'middle';
  className?: string;
};
const NoData = ({ size, className }: NoDataProps) => {
  const intl = useIntl();
  return (
    <div className={classNames('nodata', className)}>
      <img
        src={noData}
        alt="NoData"
        className={classNames({
          [size as string]: size,
        })}
      />
      <span>{intl.formatMessage({ id: 'noData' })}</span>
    </div>
  );
};

export default NoData;
