import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import { get, hasIn, isEqual } from 'lodash';
import { useState } from 'react';
import { TzSelectProps } from '.';

const usePropsAttr = <T>(
  props: TzSelectProps,
  attrName: string,
  initialVal?: any,
): [arg1: T, arg2: (val?: T) => void] => {
  const propsValue = get(props, attrName);
  const [value, setValue] = useState<any>(initialVal);

  const setValueFn = useMemoizedFn((val) => {
    setValue((prev: any) => (isEqual(prev, val) ? prev : val));
  });
  useUpdateEffect(() => {
    setValueFn(propsValue);
  }, [propsValue]);
  const triggerValue = (val?: T) => !hasIn(props, attrName) && setValueFn(val);
  return [value, triggerValue];
};
export default usePropsAttr;
