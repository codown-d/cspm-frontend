import { getCloudAccountLimit, getManageConf, getUserAccountLimit } from '@/services/cspm/UserController';
import { useEffect, useState } from 'react';

// 获取登录配置
export function useLoginConf(deps: any[] = []) {
  const [conf, setConf] = useState<API.IManageConf>(null as any);
  useEffect(() => {
    getManageConf().then(res => {
      setConf(res.data);
    })
  }, deps);
  return conf;
}

// 用户数量限制
export function useUserAccountLimit(deps: any[] = []) {
  const [userNumLimit, setUserNumLimit] = useState(0);
  useEffect(() => {
    getUserAccountLimit().then((res) => {
      setUserNumLimit(res.data?.sub_account_limit || 0);
    });
  }, deps);
  return userNumLimit;
}

// 云账户数量限制
export function useCloudAccountLimit(deps: any[] = []) {
  const [userNumLimit, setUserNumLimit] = useState(0);
  useEffect(() => {
    getCloudAccountLimit().then((res) => {
      setUserNumLimit(res.data?.cloud_account_limit || 0);
    });
  }, deps);
  return userNumLimit;
}

