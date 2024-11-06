import { Card, CardProps } from 'antd';
import { useMemo } from 'react';

import './index.less';

export const TzCard = (props: CardProps) => {
  const realProps = useMemo(() => {
    return {
      ...props,
      className: `tz-card ${props.className || ''}`,
      bodyStyle: { ...props.bodyStyle, marginTop: 0 },
    };
  }, [props]);
  return <Card {...realProps} />;
};
