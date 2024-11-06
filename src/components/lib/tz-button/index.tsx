import { Button, ButtonProps } from 'antd';
import classNames from 'classnames';
import { forwardRef, useMemo } from 'react';
import './index.less';

interface TzButtonProps extends ButtonProps {}

export const TzButton = forwardRef<HTMLElement, TzButtonProps>((props, ref) => {
  let { type = 'default' } = props;
  const realProps = useMemo(() => {
    return {
      ...props,
      className: classNames('tz-button', props.className),
      type,
    };
  }, [props]);
  return <Button ref={ref} {...realProps} />;
});
