import { storage } from '@/utils/tzStorage';
import { useLocation, useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { useEffect, useRef } from 'react';
import TzLayoutContext from './TzLayoutContext';

/**
 * 授权提供器
 * @param param0
 * @returns
 */
export default function TzLayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { refresh } = useModel('@@initialState');
  const prevLocation = useRef<any>([null, null]);
  const location = useLocation();

  useEffect(() => {
    const last = prevLocation.current[1];
    if (last?.pathname !== location.pathname) {
      prevLocation.current = [last, location];
    }
  }, [location.pathname]);

  const getPrevLocation = useMemoizedFn(() => {
    const last = prevLocation.current[1];
    if (last?.pathname !== location.pathname) {
      prevLocation.current = [last, location];
    }
    return prevLocation.current;
  });

  /**
   * 初始化登录方法
   * @param data
   * @param callback
   */
  const signin = (data: API.LoginResponse, callback: VoidFunction) => {
    const { token } = data;
    storage.set('userInfo', data, null);
    storage.setCookie('token', token);
    refresh();
    callback();
  };

  /**
   * 初始化退出方法
   * @param callback
   */
  const signout = (callback: VoidFunction) => {
    callback();
    storage.remove('userInfo');
    // storage.clearCookie();
    storage.removeCookie('token');
  };

  return (
    <TzLayoutContext.Provider
      value={{
        signin,
        signout,
        getPrevLocation,
      }}
    >
      {children}
    </TzLayoutContext.Provider>
  );
}
