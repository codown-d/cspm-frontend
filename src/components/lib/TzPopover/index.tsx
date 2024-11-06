import React, { useMemo } from 'react';

import { Popover, PopoverProps } from 'antd';
import './index.less';

export declare type TzPopoverProps = PopoverProps & {
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseLeave?: (e: MouseEvent) => void;
};
export const TzPopover = React.forwardRef<
  React.RefAttributes<unknown>,
  TzPopoverProps
>((props, ref) => {
  const realProps = useMemo(() => {
    return {
      ...props,
      ref,
      className: `tz-popover ${props.className || ''}`,
    };
  }, [props]);
  return <Popover {...realProps} />;
});
