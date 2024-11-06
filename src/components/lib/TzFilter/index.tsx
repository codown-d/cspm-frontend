import classNames from 'classnames';
import { useContext } from 'react';
import InputFilter from './InputFilter';
import './index.less';
import { FilterContext } from './useTzFilter';

export type TFilterProps = {
  className?: string;
  inputStyle?: any;
};
const Filter = ({ className, inputStyle }: TFilterProps) => {
  const context = useContext?.(FilterContext);
  const { popoverFilterData } = context;

  return (
    <div className={classNames('tz-filter', className)}>
      <InputFilter inputStyle={inputStyle} />
      {/* {!get(context, 'state.filterFormItems')?.length ? (
        popoverFilterData?.length ? (
          <PopoverFilter
            icon={<i className="icon iconfont icon-shaixuan tz-filter-icon" />}
            addTipPlacement="topRight"
          />
        ) : null
      ) : (
        <Reset />
      )} */}
    </div>
  );
};

export default Filter;
