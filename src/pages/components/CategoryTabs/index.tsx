import TzTabs, { TzTabsProps } from '@/components/lib/TzTabs';
import classNames from 'classnames';
import { TabItems } from '../Chart/util';
import './index.less';

function CategoryTabs({ className, ...restProps }: TzTabsProps) {
  return (
    <TzTabs
      className={classNames('common-type-bar', className)}
      defaultActiveKey="platform"
      items={TabItems}
      {...restProps}
    />
  );
}

export default CategoryTabs;
