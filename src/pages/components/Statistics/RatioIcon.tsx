import classNames from 'classnames';
import { memo, useMemo } from 'react';

type IProps = {
  ratio_type: API.RatioType;
};
const baseCls = 'icon iconfont text-base size-4';
function RatioIcon({ ratio_type }: IProps) {
  const upIcon = useMemo(
    () => (
      <span
        className={classNames(baseCls, 'text-[#E95454] icon-iconshangsheng')}
      />
    ),
    [],
  );
  const downIcon = useMemo(
    () => (
      <span
        className={classNames(baseCls, 'text-[#52C41A] icon-iconxiajiang')}
      />
    ),
    [],
  );
  const levelIcon = useMemo(
    () => (
      <span className={classNames(baseCls, 'text-[#7F8EA8] icon-chiping')} />
    ),
    [],
  );

  if (ratio_type === '0') {
    return levelIcon;
  }
  if (ratio_type === '1') {
    return upIcon;
  }
  return downIcon;
}

export default memo(RatioIcon);
