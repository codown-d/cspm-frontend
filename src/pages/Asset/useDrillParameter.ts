import usePlatformKeys from '@/hooks/usePlatformKeys';
import { history, useLocation, useModel } from '@umijs/max';
import { get, toNumber } from 'lodash';
import { Key, useEffect, useMemo, useState } from 'react';
import { IDashboardState } from '../Dashboard/interface';

const useDrillParameter = () => {
  const { state } = useLocation();
  const {
    category: categoryState,
    key,
    risk_types,
  } = (state as IDashboardState) ?? {};
  const { platformKeys, platformsOpt } = usePlatformKeys();

  const [platforms, setPlatforms] = useState<undefined | string[]>(
    () =>
      (category === 'platform' ? [key as string] : undefined) ?? platformKeys,
  );
  const { initialState } = useModel('@@initialState');
  const { servicesMap } = initialState ?? {};

  const { pathname } = useLocation();
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (['/asset/list'].includes(pathname)) {
        history.replace({
          pathname: window.location.pathname, // 保留当前路径
          // @ts-ignore
          state: null, // 清除 state
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);

  const [drillId, setDrillId] = useState<Key | undefined>(key);
  const [category, setCategory] = useState<API.Category>(categoryState);
  const defaultFilterItemVal = useMemo(() => {
    if (!drillId) {
      return {};
    }
    const defatulParams = { riskTypeIds: risk_types };
    if (category === 'credential') {
      return { ...defatulParams, credentialIds: [toNumber(drillId)] };
    }
    if (category === 'region') {
      return { ...defatulParams, regionIds: [drillId] };
    }
    if (category === 'service') {
      return {
        ...defatulParams,
        assetTypeIds: get(servicesMap, drillId as string),
      };
    }
    return { ...defatulParams, platformIds: [drillId] };
  }, [state, category, drillId]);

  return {
    drillId,
    setDrillId,
    category,
    setCategory,
    defaultFilterItemVal,
    platforms,
    setPlatforms,
    platformsOpt,
  };
};

export default useDrillParameter;
