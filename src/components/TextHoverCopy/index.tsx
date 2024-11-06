import { copyText } from '@/utils';
import { Typography } from 'antd';
import { merge } from 'lodash';
import React, { useState } from 'react';
import './index.less';

const TextHoverCopy = (props: {
  text: string;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
  lineClamp?: number;
}) => {
  const { style = {}, text, className = '', lineClamp = 1 } = props;
  let [showTooltip, setShowTooltip] = useState(false);
  if (!props.text && !props?.children) {
    return <span>-</span>;
  }
  return (
    <div className={`flex-r text-hover-copy ${className}`} style={merge(style)}>
      <div
        className={'text-hover-copy-content'}
        style={{
          maxWidth: showTooltip ? 'calc(100%)' : '100%',
          display: 'flex',
          overflow: 'hidden',
          height: lineClamp === 1 ? '22px' : 'auto',
        }}
        onClick={(event) => {
          event.stopPropagation();
          copyText(text);
        }}
      >
        <Typography.Text ellipsis={{ tooltip: text }}>
          {props.children || text}
        </Typography.Text>
        <i className="icon iconfont icon-fuzhi ml4"></i>
      </div>
    </div>
  );
};

export default TextHoverCopy;
