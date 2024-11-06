import { TzTooltip } from '@/components/lib/tz-tooltip';
import { useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Space } from 'antd';
import { isString } from 'lodash';
import { useMemo } from 'react';
type RenderPIconProps = {
  platform?: string | string[];
  className?: string;
  showTooltip?: boolean;
  noWrap?: boolean;
};
function RenderPIcon({
  platform,
  className,
  showTooltip,
  noWrap,
}: RenderPIconProps) {
  const { initialState } = useModel('@@initialState');
  const { commonPlatforms } = initialState ?? {};

  const getIcon = useMemoizedFn(
    (p: string) => commonPlatforms?.find((v) => v.value === p),
  );
  if (!platform) {
    return null;
  }

  const platforms = isString(platform) ? [platform] : platform;
  const _showTooltip = showTooltip ?? !isString(platform);
  const RenderItem = useMemo(
    () =>
      platforms.map((item: string) => {
        const { icon, label } = getIcon(item) ?? {};
        const Node = (
          <img className="p-icon" src={icon} alt={item} key={item} />
        );
        return _showTooltip ? (
          <TzTooltip key={item} title={label}>
            {Node}
          </TzTooltip>
        ) : (
          Node
        );
      }),
    [platforms],
  );

  return noWrap ? (
    RenderItem
  ) : (
    <Space size={8} className={className}>
      {RenderItem}
    </Space>
  );
}

export default RenderPIcon;
