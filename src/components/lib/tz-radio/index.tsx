import { Radio } from 'antd';
import { RadioGroupProps, RadioProps, RadioRef } from 'antd/lib/radio';
import { forwardRef, useMemo } from 'react';
import './index.less';

const { Group } = Radio;
export const TzRadio = forwardRef<RadioRef, RadioProps>(
  (props: RadioProps, ref) => {
    const realProps = useMemo(() => {
      return {
        ...props,
        className: `tz-radio ${props.className || ''}`,
      };
    }, [props]);
    return <Radio ref={ref} {...realProps} />;
  },
);
export const TzRadioGroup = forwardRef(
  (props: RadioGroupProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const realProps = useMemo(() => {
      return {
        ...props,
        className: `tz-radio-group ${props.className || ''}`,
      };
    }, [props]);
    return <Group ref={ref} {...realProps} />;
  },
);
