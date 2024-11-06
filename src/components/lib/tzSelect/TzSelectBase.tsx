import NoData from '@/components/NoData';
import { Select, Typography } from 'antd';
import {
  BaseOptionType,
  DefaultOptionType,
  SelectProps,
} from 'antd/lib/select';
import classNames from 'classnames';
import { forwardRef, useMemo, useRef } from 'react';
import './index.less';
import usePropsAttr from './usePropsAttr';

export type TzSelectBaseProps = SelectProps<
  any,
  BaseOptionType | DefaultOptionType
> & {
  // options: (BaseOptionType | DefaultOptionType)[];
  label?: string;
  groupClass?: string;
  // 是否是selection展示形式，默认true
  isSelection?: boolean;
};

const TzSelectBase = forwardRef((props: TzSelectBaseProps, ref?: any) => {
  const { groupClass, label, isSelection = true, ...rest } = props;
  const {
    value: valueProps,
    defaultValue,
    placeholder,
    popupClassName,
    suffixIcon,
    className,
    onDropdownVisibleChange,
    disabled,
    dropdownRender,
    allowClear = true,
  } = rest;
  const [value, setValue] = usePropsAttr(
    props,
    'value',
    valueProps || defaultValue,
  );
  const [open, setOpen] = usePropsAttr(props, 'open');
  const openRef = useRef<boolean>(false);

  const tagRender = (item: any) => {
    return (
      <span className="tz-select-selection-item tz-select-selection-item">
        <span className="tz-select-selection-ellipsis-wrap">
          <Typography.Text
            // style={{ width: 100 }}
            ellipsis={{ tooltip: item.label }}
          >
            {item.label}
          </Typography.Text>
          {!allowClear || disabled ? null : (
            <i
              className={'icon iconfont icon-close f16 ml-1 leading-4 mt-[2px]'}
              onClick={item.onClose}
            ></i>
          )}
          {/* <EllipsisPopover lineClamp={1}>{item.label}</EllipsisPopover> */}
        </span>
      </span>
    );
  };

  const realProps = useMemo(
    (): TzSelectBaseProps => ({
      listHeight: 235,
      ...rest,
      dropdownRender: (node) => {
        if (dropdownRender) {
          return dropdownRender(node);
        }
        return <div key={+openRef.current}>{node}</div>;
      },
      label,
      placeholder: label ? '' : placeholder,
      suffixIcon: suffixIcon || (
        <i
          className={`icon iconfont icon-arrow f16 ${open ? 'rotate180' : ''}`}
        />
      ),
      popupClassName: classNames('tz-select-dropdown', popupClassName),
      className: classNames('tz-select', className),
      onDropdownVisibleChange: (open: any) => {
        setOpen(open);
        onDropdownVisibleChange?.(open);
      },
      onFocus: (e) => {
        openRef.current = true;
        rest.onFocus?.(e);
      },
      onBlur: (e) => {
        openRef.current = false;
        rest.onBlur?.(e);
      },
      onChange: (val, option) => {
        setValue(val);
        props.onChange?.(val, option);
      },
    }),
    [props, open],
  );

  return (
    <Select
      notFoundContent={<NoData small={true} />}
      tagRender={tagRender}
      {...(realProps as any)}
      value={value}
      ref={ref}
    />
  );
});
export default TzSelectBase;
