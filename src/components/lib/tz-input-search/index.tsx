import useLayoutMainSearchWid from '@/components/hooks/useLayoutMainSearchWid';
import { useIntl } from '@umijs/max';
import { SearchProps } from 'antd/lib/input/Search';
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { TzInput } from '../TzInput';
import { TzButton } from '../tz-button';
import './index.scss';

export const TzInputSearch = forwardRef((props: SearchProps, ref?: any) => {
  const [value, setValue] = useState<any>(undefined);
  const fitlerWid = useLayoutMainSearchWid();
  const intl = useIntl();
  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  let onSearch = useCallback(
    (val?: any) => {
      props.onSearch?.(val);
    },
    [props.onSearch],
  );

  const {onSearch: _, ...restProps} = props;

  const realProps = useMemo(() => {
    return {
      ...restProps,
      prefix: (
        <i
          className={'icon iconfont icon-sousuo'}
          style={{ fontSize: '14px', marginRight: '4px', color: '#B3BAC6' }}
        />
      ),
      style: Object.assign(
        {
          width: props.width || fitlerWid || '360px',
          background: 'rgba(244, 246, 250, 1)',
        },
        props.style,
      ),
      suffix: props.suffix ? (
        <TzButton
          type="primary"
          size="small"
          onClick={() => {
            onSearch(value);
          }}
        >
          {intl.formatMessage({ id: 'input.search' })}
        </TzButton>
      ) : null,
      onChange: (event: any) => {
        setValue(event.target.value);
        props.onChange && props.onChange(event.target.value);
      },
      onPressEnter: (event: any) => {
        onSearch(event.target.value);
        props.onPressEnter && props.onPressEnter(event.target.value);
      },
      className: `tz-input-search ${props.className || ''}`,
    };
  }, [props, value, fitlerWid]);
  return <TzInput {...realProps} ref={ref} value={value} />;
});
export default TzInputSearch;
