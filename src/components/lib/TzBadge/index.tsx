import { Badge, BadgeProps } from 'antd';
import { useMemo } from 'react';

export type TzBadgeProps = BadgeProps & {};

const TzBadge = (props: TzBadgeProps) => {
  const realProps = useMemo(() => {
    return {
      overflowCount: 999999999999,
      ...props,
      className: `tz-badge ${props.className || ''}`,
    };
  }, [props]);
  return <Badge {...realProps} />;
};

export default TzBadge;
