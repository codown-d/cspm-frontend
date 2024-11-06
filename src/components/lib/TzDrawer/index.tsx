import { Drawer, DrawerProps } from 'antd';
import classNames from 'classnames';
import { FC } from 'react';
import './index.less';

export type TzDrawerProps = DrawerProps & {
  className?: string;
};
const TzDrawer: FC<TzDrawerProps> = (props) => {
  const { className, ...restProps } = props;

  return (
    <Drawer
      closeIcon={<i className={'icon iconfont icon-close f24'} />}
      {...restProps}
      className={classNames(className, 'tz-drawer')}
    />
  );
};
if (process.env.NODE_ENV !== 'production') {
  TzDrawer.displayName = 'TzDrawer';
}
export default TzDrawer;
