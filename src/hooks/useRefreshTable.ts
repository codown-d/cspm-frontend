import { ActionType } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { delay, isFunction } from 'lodash';
import React, { useEffect } from 'react';

// 监听路由变化，调用 history.back() 时刷新表格数据
export default function useRefreshTable(
  actionObj: React.RefObject<ActionType | undefined> | VoidFunction,
) {
  useEffect(() => {
    const listenCb = (param: any) => {
      if (param.action === 'POP') {
        console.debug('! reload', actionObj);
        if (isFunction(actionObj)) {
          actionObj();
        } else {
          (
            actionObj as React.RefObject<ActionType | undefined>
          )?.current?.reload?.();
        }
      }
    };
    const unlisten = history.listen((...args) => delay(listenCb, 300, ...args));
    return () => unlisten();
  }, []);
}
