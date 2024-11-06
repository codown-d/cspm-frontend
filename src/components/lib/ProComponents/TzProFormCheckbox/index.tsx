import { ProFormCheckbox } from '@ant-design/pro-components';
import classNames from 'classnames';
import './index.less';
const TzProFormCheckbox = (props: any) => {
  const { className, ...restProps } = props;
  return (
    <ProFormCheckbox
      fieldProps={{ className: classNames('tz-checkbox', className) }}
      {...restProps}
    />
  );
};

const TzProFormCheckboxGroup = (props: any) => {
  const { className, ...restProps } = props;

  return (
    <ProFormCheckbox.Group
      fieldProps={{ className: classNames('tz-checkbox-group', className) }}
      {...restProps}
    />
  );
};
TzProFormCheckbox.Group = TzProFormCheckboxGroup;
export default TzProFormCheckbox;
