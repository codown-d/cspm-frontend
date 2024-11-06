import { NONE_PLATFORM } from '@/utils';
import { useIntl } from '@umijs/max';
import classNames from 'classnames';
import RenderColWithIcon from './RenderColWithPlatformIcon';

type IPlatformTableTit = {
  platform?: string;
  extra?: string | number;
};
function PlatformTableTit({
  platform = NONE_PLATFORM,
  extra,
}: IPlatformTableTit) {
  const intl = useIntl();
  return (
    <div
      className={classNames('inline-flex items-center text-[#3E4653]', {
        hidden: platform === NONE_PLATFORM,
      })}
    >
      {intl.formatMessage({ id: 'cPlatform' })}：
      <div className="inline-flex -mr-[2px]">
        <RenderColWithIcon className="mr-2 inline-block" platform={platform} />
      </div>
      {extra}
    </div>
  );
}

export default PlatformTableTit;
