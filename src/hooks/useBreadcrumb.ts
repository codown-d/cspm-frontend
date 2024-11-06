import { useLocation, useRouteProps } from '@umijs/max';
import { ItemType } from 'antd/lib/breadcrumb/Breadcrumb';
import { cloneDeep, last, slice } from 'lodash';
import { useMemo } from 'react';

export default function useBreadcrumb(prop?: ItemType[]) {
  const { breadcrumb } = useRouteProps();
  const { pathname } = useLocation();
  const curBreadcrumb = useMemo(() => {
    const ibL = prop?.length ?? 0;
    if (ibL) {
      return slice(prop, 0, ibL - 1);
    }
    const _breadcrumb = cloneDeep(breadcrumb);
    const lastItem = last(_breadcrumb) as ItemType;
    lastItem.path = pathname;
    return _breadcrumb;
  }, [pathname, breadcrumb, prop]);
  return curBreadcrumb;
}
