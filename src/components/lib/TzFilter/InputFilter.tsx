import useLayoutMainSearchWid from '@/components/hooks/useLayoutMainSearchWid';
import { useIntl } from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import { InputRef } from 'antd';
import { get } from 'lodash';
import { FormEvent, memo, useContext, useMemo, useRef, useState } from 'react';
import { TzInput } from '../TzInput';
import { FilterContext } from './useTzFilter';

const InputFilter = ({ inputStyle }: { inputStyle?: any }) => {
  const context = useContext?.(FilterContext);
  const {
    addFilter: onChange,
    inputFilterData,
    state: { fitlerFormValues },
  } = context;
  const inputItem = get(inputFilterData, [0]);
  const inputRef = useRef<InputRef>(null);
  const intl = useIntl();

  const filterVal = get(fitlerFormValues, inputItem?.name);

  const [value, setValue] = useState<any>(filterVal);
  useUpdateEffect(() => {
    setValue(filterVal);
  }, [filterVal]);

  const placeholder = useMemo(
    () =>
      inputItem?.props?.placeholder ??
      intl.formatMessage({ id: 'txtTips' }, { name: inputItem?.label }),
    [inputItem],
  );

  const trigger = useMemoizedFn((value) => {
    onChange({ ...inputItem, value });
  });

  const fitlerWid = useLayoutMainSearchWid({ min: 320 });

  return inputItem ? (
    <TzInput
      ref={inputRef}
      placeholder={placeholder}
      className="tz-input-fitler"
      style={{
        // width: `${fitlerWid}px`,
        ...inputStyle,
      }}
      value={value}
      onChange={(e: FormEvent<HTMLInputElement>) =>
        setValue((e.target as any).value)
      }
      allowClear={{
        clearIcon: (
          <i
            onClick={() => trigger(undefined)}
            className="icon iconfont tz-icon icon-clear mr-2"
          />
        ),
      }}
      maxLength={100}
      onPressEnter={() => inputRef.current?.blur()}
      onBlur={() => trigger(value)}
      prefix={<i className="tz-icon icon iconfont icon-sousuo" />}
    />
  ) : null;
};

export default memo(InputFilter);
