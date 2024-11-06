import { TzTooltip } from '@/components/lib/tz-tooltip';
import { useSize } from 'ahooks';
import classNames from 'classnames';
import React, { useRef } from 'react';
import './index.less';

export const ToolTipAny: React.FC<any> = ({ children, className }) => {
  const wrapDom = useRef<HTMLDivElement>(null);
  const wrapDomWidth = useSize(wrapDom)?.width ?? 0;
  const contentDom = useRef<HTMLDivElement>(null);
  const contentDomWidth = useSize(contentDom)?.width ?? 0;
  const needTooltip =
    wrapDomWidth && contentDomWidth && contentDomWidth > wrapDomWidth;
  return (
    <div
      className={classNames(`flex items-center tooltip-any-kla`, className, {
        overflow: needTooltip,
      })}
      ref={wrapDom}
    >
      <TzTooltip
        title={children}
        disabled={!needTooltip}
        placement={'bottomLeft'}
        rootClassName={'tooltip-overcls-a1'}
      >
        <div ref={contentDom} className={'content-x11'}>
          {children}
        </div>
      </TzTooltip>
    </div>
  );
};
