import { TzTooltip } from '@/components/lib/tz-tooltip';
import TzTypography from '@/components/lib/TzTypography';
import { useModel } from '@umijs/max';
import { ReactNode, useMemo } from 'react';

type RenderColWithIconProps = {
  platform?: string;
  name?: string | ReactNode;
  ellipsisRows?: number | boolean;
  noEmpty?: boolean;
  className?: string;
  tooltip?: boolean;
};
function RenderColWithIcon({
  platform = '',
  name,
  ellipsisRows = 2,
  noEmpty,
  className = '',
  tooltip = true,
}: RenderColWithIconProps) {
  const { initialState } = useModel('@@initialState');
  const { commonPlatforms } = initialState ?? {};

  const [item, _name] = useMemo(() => {
    const obj = commonPlatforms?.find((v) => v.value === platform);
    return [obj, noEmpty ? '' : (name ?? obj?.name) || '-'];
  }, [commonPlatforms, name]);

  const Img = useMemo(
    () => <img className="p-icon mr-[6px]" src={item?.icon} alt="icon" />,
    [item],
  );
  return (
    <div className={`flex items-center render-col-platformiconm1 ${className}`}>
      {!!item?.icon && <TzTooltip title={item?.label}>{Img}</TzTooltip>}
      {ellipsisRows ? (
        <TzTypography.Paragraph
          ellipsis={{ rows: +ellipsisRows, tooltip: tooltip ? _name : '' }}
        >
          <span>{_name}</span>
        </TzTypography.Paragraph>
      ) : (
        <span>{_name}</span>
      )}
    </div>
  );
}

export default RenderColWithIcon;
