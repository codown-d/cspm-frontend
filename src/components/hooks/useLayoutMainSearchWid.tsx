import { useModel } from '@umijs/max';
import { useMemo } from 'react';

type TUseLayoutMainSearchWid =
  | undefined
  | {
      max?: number;
      min?: number;
      pagePadding?: number;
      ratio?: number;
    };
const useLayoutMainSearchWid = (param?: TUseLayoutMainSearchWid) => {
  const { max = 480, min = 280, pagePadding = 64, ratio } = param || {};
  const { containerW } = useModel('layout');

  // const { width = 0 } =
  //   useSize(document.querySelector('.ant-page-header')) ?? {};
  // const containerW = useDebounce(floor(width), { wait: 500 });

  const wid = useMemo(() => {
    const _wid = containerW
      ? (containerW - pagePadding) * (ratio ?? 0.33)
      : min;
    if (_wid > max) {
      return max;
    }
    if (_wid > min) {
      return _wid;
    }
    return min;
  }, [containerW]);

  return wid;
};

export default useLayoutMainSearchWid;
