import { useDebounceEffect, useSize, useUpdateEffect } from 'ahooks';
import { useState } from 'react';
import { useImmer } from 'use-immer';

export type LayoutContextValues = {
  containerW: number;
  containerH: number;
};
type Size = {
  containerW: number;
  containerH: number;
};
export default function layoutModel() {
  const [containerSize, setContainerSize] = useImmer<Size>({
    containerW: 0,
    containerH: 0,
  });
  const { width = 0, height = 0 } = useSize(document.body) ?? {};
  const [collapsed, setCollapsed] = useState<boolean>(width < 1280);

  useUpdateEffect(() => {
    width < 1280 && setCollapsed(true);
  }, [width]);

  useDebounceEffect(
    () => {
      setContainerSize((draft) => {
        draft.containerW = (width ?? 0) - (collapsed ? 64 : 200);
        draft.containerH = height ?? 0;
      });
    },
    [width, height, collapsed],
    { wait: 100 },
  );

  return {
    ...containerSize,
    collapsed,
    setCollapsed,
  };
}
