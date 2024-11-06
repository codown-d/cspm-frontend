import { Steps, StepsProps } from 'antd';
import { useMemo } from 'react';

import './index.less';

export const TzSteps = (props: StepsProps) => {
  const realProps = useMemo(() => {
    return {
      ...props,
      className: `tz-steps ${props.className || ''}`,
    };
  }, [props]);
  return <Steps {...realProps} />;
};
