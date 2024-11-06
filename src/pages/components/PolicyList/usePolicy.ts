import { get, keyBy } from 'lodash';
import { useMemo } from 'react';
import { IPolicyTableFilterProps } from './interface';

export const usePolicy = (
  data?: IPolicyTableFilterProps,
  platform?: string,
) => {
  const { serviceItem, scanResItem } = data ?? {};

  const scanResTypesOption = useMemo(() => {
    const arr = get(scanResItem, 'props.options', [])?.map((item) => ({
      ...item,
      text: item.label,
      status: item.value,
    }));
    return keyBy(arr, 'status');
  }, [scanResItem]);

  // const scanTypeOption = useMemo(() => {
  //   const arr = get(scanTypeItem, 'props.options', [])?.map((item) => ({
  //     ...item,
  //     text: item.label,
  //     status: item.value,
  //   }));
  //   return keyBy(arr, 'status');
  // }, [scanTypeItem, platform]);

  // const servicesOption = useMemo(() => {
  //   if (!serviceItem) {
  //     return;
  //   }
  //   const arr = get(serviceItem, 'props.options', [])
  //     .find((item) => item.value === platform)
  //     ?.children?.map((item) => ({
  //       ...item,
  //       text: item.label,
  //       status: item.value,
  //     }));
  //   return keyBy(arr, 'value');
  // }, [serviceItem, platform]);

  return {
    // servicesOption,
    scanResTypesOption,
  };
};
