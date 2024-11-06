import { Input, InputProps, InputRef } from 'antd';
import Group from 'antd/lib/input/Group';
import Password from 'antd/lib/input/Password';
import Search from 'antd/lib/input/Search';
import TextArea from 'antd/lib/input/TextArea';
import classNames from 'classnames';
import { forwardRef } from 'react';
import './index.less';

export const TzInput = forwardRef<InputRef, InputProps>((props, ref) => {
  const { className, ...restProps } = props;
  return (
    <Input
      {...restProps}
      ref={ref}
      className={classNames('tz-input', className)}
    />
  );
}) as React.ForwardRefExoticComponent<
  InputProps & React.RefAttributes<InputRef>
> & {
  Group: typeof Group;
  Search: typeof Search;
  TextArea: typeof TextArea;
  Password: typeof Password;
};
TzInput.TextArea = Input.TextArea;
TzInput.Password = Input.Password;
