import { InputNumber, InputNumberProps } from 'antd';
import { forwardRef, useMemo } from 'react';
import './index.less';
export const TzInputNumber = forwardRef(
  (props: InputNumberProps, ref?: any) => {
    const realProps = useMemo(() => {
      return {
        ...props,
        className: `tz-input-number ${props.className || ''}`,
      };
    }, [props]);
    return <InputNumber {...realProps} ref={ref} />;
  },
);
