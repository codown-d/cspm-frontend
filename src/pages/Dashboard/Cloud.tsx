import { useIntl } from '@umijs/max';
import classNames from 'classnames';
import { memo } from 'react';
import PlatformClassify from '../CloudPlatform/Credentials/PlatformClassify';

function CloudStatics() {
  const intl = useIntl();
  return (
    <div className={classNames('w-full')}>
      <div className="head-tit-1 mb-4">
        {intl.formatMessage({ id: 'cloudAccountStatistics' })}
      </div>
      <div className="min-h-[68px]">
        <PlatformClassify />
      </div>
    </div>
  );
}
export default memo(CloudStatics);
