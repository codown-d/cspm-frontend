import TzLayoutContext from '@/contexts/TzLayoutContext';
import React from 'react';

/**
 * 获取用户授权信息
 * @returns
 */
export default function useAuth() {
  return React.useContext(TzLayoutContext);
}
