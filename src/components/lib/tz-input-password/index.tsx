import { PasswordProps } from 'antd/es/input/Password';
import classNames from 'classnames';
import { useMemo } from 'react';
import { TzInput } from '../TzInput';
import '../TzInput/index.less';
import './index.less';

export const TzInputPassword = (props: PasswordProps) => {
  const realProps = useMemo(() => {
    return {
      ...props,
      className: classNames(`tz-input tz-input-password`, props.className),
    };
  }, [props]);
  return <TzInput.Password {...realProps} />;
};
