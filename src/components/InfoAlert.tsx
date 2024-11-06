import TzAlert from '@/components/lib/TzAlert';
import classNames from 'classnames';
import { ReactNode } from 'react';

function InfoAlert({
  tip,
  className,
  icon,
}: {
  tip: ReactNode | string;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <TzAlert
      className={classNames('custom-alert-info', className)}
      description={
        <div className="text-[#2177D1] leading-[22px] flex">
          <div className="inline-flex justify-center items-center h-[22px] mr-1">
            {icon ?? <i className="icon iconfont icon-banben text-sm" />}
          </div>
          <span>{tip}</span>
        </div>
      }
      type="info"
    />
  );
}

export default InfoAlert;
