import { TzPopover } from '@/components/lib/TzPopover';
import TzTypography from '@/components/lib/TzTypography';

type RenderTipByOverlayProps = {
  txt: string;
  description?: string;
};
export const RenderTipByOverlay = ({
  txt,
  description,
}: RenderTipByOverlayProps) => {
  if (!txt) {
    return '-';
  }

  return (
    <TzPopover
      placement="bottomLeft"
      arrow={false}
      title={txt}
      overlayClassName="render-tip-overlay"
      content={<div>{description ?? '-'}</div>}
      destroyTooltipOnHide
    >
      <TzTypography.Paragraph ellipsis={{ rows: 2, tooltip: '' }}>
        <div className="cursor-pointer">{txt}</div>
      </TzTypography.Paragraph>
    </TzPopover>
  );
};
