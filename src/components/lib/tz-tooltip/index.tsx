import { Tooltip } from 'antd';
import { TooltipProps } from 'antd/lib/tooltip';
import React, { useMemo } from 'react';

import './index.less';

export declare type TzTooltipProps = TooltipProps & {
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseLeave?: (e: MouseEvent) => void;
  disabled?: boolean;
};
export const TzTooltip = React.forwardRef<
  React.RefAttributes<unknown>,
  TzTooltipProps
>((props, ref) => {
  const realProps = useMemo(() => {
    return {
      destroyTooltipOnHide: true,
      ...props,
      ref,
      className: `tz-tooltip ${props.className || ''}`,
    };
  }, [props]);
  if (props.disabled) {
    return props.children;
  }
  return <Tooltip {...realProps} />;
});
