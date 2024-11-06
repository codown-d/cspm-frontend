import { useIntl } from '@umijs/max';
import { useContext } from 'react';
import { TzTooltip } from '../tz-tooltip';
import { FilterContext } from './useTzFilter';
const Clear = () => {
  const context = useContext?.(FilterContext);
  const { clearFormItems } = context;
  const intl = useIntl();
  return (
    <TzTooltip
      title={intl.formatMessage({ id: 'filter.emptyCondition' })}
      placement="topRight"
    >
      <div className="tz-filter-clear" onClick={clearFormItems}>
        <i className="icon iconfont tz-filter-icon icon-qingchu" />
      </div>
    </TzTooltip>
  );
};
export default Clear;
