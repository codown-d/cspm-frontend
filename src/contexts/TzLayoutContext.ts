import React from 'react';

/**
 * 授权类型
 */
export interface TzLayoutContextType {
  /**
   * 用户信息
   */
  user?: Omit<API.LoginResponse, 'token'>;
  /**
   * 登录系统
   */
  signin: (user: API.LoginResponse, callback: VoidFunction) => void;
  /**
   * 退出系统
   */
  signout: (callback: VoidFunction) => void;
  /**
   * 前一级location
   */
  getPrevLocation: () => [Location, Location];
}

/**
 * 创建授权上下文
 */
const TzLayoutContext = React.createContext<TzLayoutContextType>(null!);

export default TzLayoutContext;
