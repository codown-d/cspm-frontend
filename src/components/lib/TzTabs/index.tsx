import { Tabs, TabsProps } from 'antd';
import { useMemo } from 'react';
import './index.less';

export type TzTabsProps = TabsProps & {};

const TzTabs = (props: TzTabsProps) => {
  const realProps = useMemo(() => {
    return {
      ...props,
      className: `tz-tabs ${props.className || ''}`,
    };
  }, [props]);
  return <Tabs {...realProps} />;
};

TzTabs.TzTabPane = Tabs.TabPane;
export default TzTabs;
