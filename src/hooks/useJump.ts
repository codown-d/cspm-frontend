import TzLayoutContext from '@/contexts/TzLayoutContext';
import { history } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { useContext } from 'react';
import { flushSync } from 'react-dom';

function useJump() {
  const { getPrevLocation } = useContext(TzLayoutContext);

  const nextTo = useMemoizedFn(
    (routeName: string, state?: Record<string, any>) => {
      const prevLocation = getPrevLocation();
      const prevPN = prevLocation?.map((v) => v?.pathname);
      if (prevPN.includes(routeName)) {
        flushSync(() => {
          history.back();
          setTimeout(() => {
            history.replace(routeName, { keepAlive: true, ...state });
          }, 100);
        });
      } else {
        history.replace(routeName, { keepAlive: true, ...state });
      }
    },
  );

  return { nextTo };
}

export default useJump;
