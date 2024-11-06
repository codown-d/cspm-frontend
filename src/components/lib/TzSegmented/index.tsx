import { Segmented, SegmentedProps } from 'antd';
import { forwardRef, useMemo } from 'react';
import './index.less';

export type TzSegmentedProps = SegmentedProps & {};

const TzSegmented = forwardRef((props: TzSegmentedProps, ref: any) => {
  const realProps = useMemo(() => {
    return {
      ...props,
      className: `tz-segmented ${props.className || ''}`,
    };
  }, [props]);
  return <Segmented ref={ref} {...realProps} />;
});

export default TzSegmented;
