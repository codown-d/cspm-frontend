import { Checkbox } from 'antd';
import {
  CheckboxGroupProps,
  CheckboxProps,
  CheckboxRef,
} from 'antd/lib/checkbox';
import { forwardRef, useMemo } from 'react';
import './index.less';

const { Group } = Checkbox;
export const TzCheckbox = forwardRef<CheckboxRef, CheckboxProps>(
  (props: CheckboxProps, ref) => {
    const realProps = useMemo(() => {
      return {
        ...props,
        className: `tz-checkbox ${props.className || ''}`,
      };
    }, [props]);
    return <Checkbox ref={ref} {...realProps} />;
  },
);
export const TzCheckboxGroup = forwardRef(
  (props: CheckboxGroupProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const realProps = useMemo(() => {
      return {
        ...props,
        className: `tz-checkbox-group ${props.className || ''}`,
      };
    }, [props]);
    return <Group ref={ref} {...realProps} />;
  },
);
