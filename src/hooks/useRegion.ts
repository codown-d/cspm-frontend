import { getRegions } from '@/services/cspm/CloudPlatform';
import { useMemoizedFn } from 'ahooks';
import { cloneDeep, isArray, isString } from 'lodash';
import { useEffect, useState } from 'react';

let treeDataCache;
export function useRegion(
  platform?: string | string[],
  use_case?: 'agentless',
) {
  const [regionTree, setRegionTree] = useState<API.RegionsResponse[]>();

  const getDataByParam = useMemoizedFn((data?: API.RegionsResponse[]) => {
    if (!data?.length || !platform) {
      return data;
    }

    let _res = data;
    if (isString(platform)) {
      _res = _res?.find((v) => v.key === platform)
        ?.children as API.RegionsResponse[];
    } else if (isArray(platform)) {
      _res =
        platform.length === 1
          ? (_res?.find((v) => v.key === platform[0])
              ?.children as API.RegionsResponse[])
          : (_res?.filter((v) =>
              platform.includes(v.key),
            ) as API.RegionsResponse[]);
    }
    return _res;
  });

  useEffect(() => {
    if (treeDataCache?.length) {
      setRegionTree(getDataByParam(treeDataCache));
      return;
    }
    getRegions({ use_case }).then((data) => {
      const res = cloneDeep(data);
      const loop = (d: any) => {
        d.forEach((v: any) => {
          v.value = v.key;
          if (v.children?.length) {
            loop(v.children);
          }
        });
      };
      loop(res);
      treeDataCache = res;
      setRegionTree(getDataByParam(res));
    });
  }, [platform, use_case]);

  return regionTree;
}
