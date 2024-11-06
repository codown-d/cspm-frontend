import { Dropdown, DropDownProps } from 'antd';
import { useMemo } from 'react';

import './index.less';

interface TzDropDownProps extends DropDownProps {}

export const TzDropdown = (props: TzDropDownProps) => {
  const realProps = useMemo(() => {
    return {
      ...props,
      className: `tz-dropdown ${props.className || ''}`,
    };
  }, [props]);
  return <Dropdown {...realProps} />;
};
