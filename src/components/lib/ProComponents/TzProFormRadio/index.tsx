import { ProFormRadio } from '@ant-design/pro-components';
import classNames from 'classnames';
import './index.less';
const TzProFormRadio = (props: any) => {
  const { className, ...restProps } = props;
  return (
    <ProFormRadio
      fieldProps={{ className: classNames('tz-radio', className) }}
      {...restProps}
    />
  );
};

const TzProFormRadioGroup = (props: any) => {
  const { className, ...restProps } = props;

  return (
    <ProFormRadio.Group
      fieldProps={{ className: classNames('tz-radio-group', className) }}
      {...restProps}
    />
  );
};
TzProFormRadio.Group = TzProFormRadioGroup;
export default TzProFormRadio;
