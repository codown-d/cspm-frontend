import { useInViewport, useMemoizedFn } from 'ahooks';
import { MutableRefObject } from 'react';

type TargetValue<T> = T | undefined | null;
type TargetType = HTMLElement | Element | Window | Document;
type BasicTarget<T extends TargetType = Element> = MutableRefObject<
  TargetValue<T>
>;

const useTableAnchor = (
  anchorRef: BasicTarget,
  opt?: ScrollIntoViewOptions,
) => {
  const [inViewport] = useInViewport(anchorRef);
  const listOffsetFn = useMemoizedFn(() => {
    !inViewport &&
      anchorRef?.current?.scrollIntoView({ block: 'start', ...opt });
  });

  return listOffsetFn;
};

export default useTableAnchor;
