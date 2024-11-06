import { getServiceTree } from '@/services/cspm/CloudPlatform';
import { useAsyncEffect, useMemoizedFn, useUpdateEffect } from 'ahooks';
import { isArray, isString, map } from 'lodash';
import { useRef, useState } from 'react';

function useServiceTree(platform?: string | string[], onlyTop?: number) {
  const cacheData = useRef<API.CommonServicetreeResponse[]>();
  const [data, setData] = useState<API.CommonServicetreeResponse[]>();
  const [services, setServices] =
    useState<
      (API.CommonServicetreeResponse | API.CommonServicetreeResponseChild)[]
    >();
  const getServicesFn = useMemoizedFn(async (platform) => {
    const res = await getServiceTree(onlyTop);
    cacheData.current = res;
    return cacheData.current;
  });

  useAsyncEffect(async () => {
    setData((await getServicesFn(platform)) as API.CommonServicetreeResponse[]);
  }, [onlyTop]);

  useUpdateEffect(() => {
    const pIsEmpty = !platform || (isArray(platform) && !platform?.length);
    const p = isString(platform) ? [platform] : platform;
    const fn = (x: API.CommonServicetreeResponse) => ({
      ...x,
      value: x.id,
      key: x.id,
      children: x.children?.map((y) => ({
        ...y,
        value: y.id,
        key: x.id,
      })),
    });
    if (p?.length === 1) {
      setServices(
        map(
          data?.find((v) => pIsEmpty || p?.includes(v.id))?.children,
          fn,
        ) as unknown as API.CommonServicetreeResponseChild[],
      );
      return;
      // return map(services?.find((v) => pIsEmpty || p?.includes(v.id))?.children, fn);
    }
    // return map(
    //   services?.filter((v) => pIsEmpty || p?.includes(v.id)),
    //   fn,
    // );
    setServices(map(data?.filter((v) => pIsEmpty || p?.includes(v.id)), fn));
  }, [platform, data]);

  return services;
}

export default useServiceTree;
