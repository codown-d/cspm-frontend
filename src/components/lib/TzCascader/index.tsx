import NoData from '@/components/NoData';
import { useCreation, useMemoizedFn, useUpdateEffect } from 'ahooks';
import { Cascader } from 'antd';
import { DefaultOptionType } from 'antd/lib/cascader';
import classNames from 'classnames';
import { hasIn, isEqual } from 'lodash';
import {
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TzCascaderPanel } from './TzCascaderPanel';
import './index.less';
import { TreeNode, TzCascaderProps, ValuesType } from './interface';
import { mergeOptions } from './util';

const TzCascader = forwardRef((props: TzCascaderProps, ref) => {
  const { options: propsOptions, query } = props;
  const [options, setOptions] = useState(propsOptions || []);
  const [value, setValue] = useState<any>(
    props.value ?? props.defaultValue ?? [],
  );
  const [searchValue, setSearchValue] = useState<any>(props.searchValue);
  const [open, setOpen] = useState<boolean>(!!props?.open);

  useUpdateEffect(() => {
    setOptions((prev) => {
      const res: TreeNode[] | undefined = query
        ? mergeOptions(propsOptions || [], prev || [])
        : propsOptions;
      return !isEqual(prev, res) ? res || [] : prev;
    });
  }, [propsOptions]);

  const mergeOpen = hasIn(props, 'open') ? props.open : open;

  useUpdateEffect(() => {
    setSearchValue(props.searchValue);
  }, [props.searchValue]);

  useEffect(() => {
    return () => {
      !mergeOpen && setSearchValue(undefined);
    };
  }, [mergeOpen]);

  useUpdateEffect(() => {
    setValue((prev: ValuesType) => {
      return !isEqual(value, props.value) ? props.value : prev;
    });
  }, [props.value]);

  const defaultProps = useCreation(
    () => ({
      ref,
      style: { width: '100%' },
      notFoundContent: <NoData small={true} />,
      showSearch: {
        limit: 10000,
        filter: (inputValue: string, path: DefaultOptionType[]) =>
          path.some(
            (option) =>
              (option.label as string)
                .toLowerCase()
                .indexOf(inputValue.toLowerCase()) > -1,
          ),
      },
      onSearch: setSearchValue,
      searchValue,
      ...props,
      options,
      value,
      popupClassName: classNames('tz-cascader-popup', props.popupClassName),
      onChange: (val: any, option: any) => {
        props?.onChange?.(val, option);
      },
      open: mergeOpen,
      onDropdownVisibleChange: (val: boolean) => {
        !hasIn(props, 'open') && setOpen(val);
        props.onDropdownVisibleChange?.(val);
      },
      label: props.label,
      placeholder: props.label ? '' : props.placeholder,
      className: classNames(
        'tz-cascader',
        { 'select-dropdown-open': mergeOpen || value?.length },
        props.className,
      ),
      removeIcon: props.removeIcon || (
        <i
          className={'icon iconfont icon-close'}
          style={{ fontSize: '16px', fontWeight: 400, color: '#2177d1' }}
        ></i>
      ),
    }),
    [props, value, mergeOpen, searchValue, JSON.stringify(options)],
  );
  const setLoadData = useMemoizedFn((data: TreeNode[]) => {
    setOptions((prev) => (!isEqual(prev, data) ? data || [] : prev));
  });
  const idWithOpen = useMemo(() => +new Date(), [mergeOpen]);
  const dropdownRender = useCallback(
    (menus: ReactNode) => {
      const node = (
        <div
          key={idWithOpen}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <TzCascaderPanel
            {...props}
            value={value}
            showSearch={defaultProps.showSearch}
            options={options}
            setLoadData={setLoadData}
            onChange={defaultProps.onChange}
            searchValue={props.searchValue}
            open={mergeOpen}
          />
        </div>
      );
      return defaultProps.dropdownRender
        ? defaultProps.dropdownRender(node)
        : node;
    },
    [props, value, mergeOpen, options, defaultProps.onChange],
  );
  const customerProps = useMemo(
    () =>
      searchValue || !options?.length
        ? defaultProps
        : ({ ...defaultProps, dropdownRender } as any),
    [searchValue, defaultProps, mergeOpen, JSON.stringify(options)],
  );

  return <Cascader {...customerProps} />;
});
export default TzCascader;
