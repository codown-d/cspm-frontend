import { useIntl } from '@umijs/max';
import { useContext } from 'react';
import { TzTooltip } from '../tz-tooltip';
import { FilterContext } from './useTzFilter';
const Reset = () => {
  const context = useContext?.(FilterContext);
  const { resetFormItems } = context;
  const intl = useIntl();
  return (
    <TzTooltip title={intl.formatMessage({ id: 'reset' })} placement="top">
      <div className="tz-filter-clear tz-filter-rest" onClick={resetFormItems}>
        <i className="icon iconfont tz-filter-icon icon-zhongzhi text-[12px]" />
      </div>
    </TzTooltip>
  );
};
export default Reset;
