import { Alert, AlertProps } from 'antd';
import classNames from 'classnames';
import { useMemo } from 'react';
import './index.less';

export type TzAlertProps = AlertProps & {};

const TzAlert = (props: TzAlertProps) => {
  const realProps = useMemo(() => {
    return {
      ...props,

      className: classNames('tz-alert', props.className),
    };
  }, [props]);
  return <Alert {...realProps} />;
};

export default TzAlert;
