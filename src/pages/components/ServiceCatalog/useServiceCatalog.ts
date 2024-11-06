import { AssetListProps } from '@/pages/Asset/OldList/AssetsList';
import { useMemoizedFn } from 'ahooks';
import { flatten, isString, uniq } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';

type TServiceCatalog = Pick<AssetListProps, 'platform'> & {
  fetchUrl: Function;
  params?: any;
};
const useServiceCatalog = ({ fetchUrl, params, platform }: TServiceCatalog) => {
  const [servicesTree, setServicesTree] = useState<API.ServicetreeResponse[]>();
  const [selectNode, setSelectNode] = useState<string[]>();
  const originServicesTree = useRef<API.ServicetreeResponse[]>();
  const [loading, setLoading] = useState<boolean>();

  const allValues = useRef<string[]>();

  const fetchData = useMemoizedFn(async (cal?: Function) => {
    setLoading(true);
    const res = await fetchUrl(params);
    setLoading(false);

    const newRes = res.map((v) => ({
      ...v,
      isPlatform: true,
      value: v.id,
      children: v?.children?.map((x) => ({
        ...x,
        platform: v.id,
        value: x.id,
        isLeaf: true,
      })),
    }));
    originServicesTree.current = newRes;
    if (isString(platform)) {
      const itemWithP = newRes?.find((v) => v.id === platform);
      if (!itemWithP) {
        cal?.();
        return;
      }
      setServicesTree(itemWithP?.children);
      const _value: string[] = flatten(itemWithP?.children?.map((v) => v.id));
      allValues.current = _value;
      cal?.(_value);
      return;
    }
    const _value: string[] = flatten(newRes.map((v) => v.children)).map(
      (v) => v.id,
    );

    allValues.current = _value;
    setServicesTree(newRes);
    cal?.(_value);
  });

  useEffect(() => {
    fetchData(setSelectNode);
  }, [JSON.stringify(params), platform]);

  const refreshServiceTree = useMemoizedFn(() => {
    fetchData();
  });

  const platformByServiceTree: undefined | string | string[] = useMemo(
    () =>
      uniq(
        flatten(originServicesTree.current?.map((v) => v.children))
          .filter((v) => selectNode?.includes(v.id))
          .map((v) => v.platform as string),
      ),
    [selectNode],
  );

  return {
    allValues,
    setSelectNode,
    servicesTree,
    selectNode,
    platformByServiceTree,
    refreshServiceTree,
    loading,
  };
};
export default useServiceCatalog;
