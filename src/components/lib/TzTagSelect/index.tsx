import { RefSelectProps, Select, SelectProps } from 'antd';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import './index.less';

type TTzSelectTag = SelectProps & {
  value?: string[];
  onChange?: (value?: string[]) => void;
  className?: string;
};
const TzTagSelect = (props: TTzSelectTag) => {
  const { value, className, onChange, ...rest } = props;
  const [searchVal, setSearchVal] = useState<string | undefined>();
  const selectRef = useRef<RefSelectProps>(null);
  const keyCode = useRef<number | null>(null);

  return (
    <Select
      showSearch
      searchValue={searchVal}
      onSearch={(e) => {
        if (e) {
          setSearchVal(e);
        } else {
          setSearchVal(keyCode.current !== 8 ? searchVal : undefined);
          selectRef.current?.focus?.();
        }
      }}
      onBlur={() => setSearchVal(undefined)}
      onClear={() => {
        keyCode.current = 8;
        setSearchVal(undefined);
      }}
      onChange={(v) => {
        onChange?.(v?.length ? v : undefined);
      }}
      onInputKeyDown={(e) => {
        keyCode.current = e.keyCode;
        if (e.keyCode === 32) {
          e.stopPropagation();
          e.preventDefault();
          return;
        }
        if (e.keyCode === 13) {
          if (searchVal) {
            value?.includes(searchVal) && e.stopPropagation();
            setSearchVal(undefined);
          } else {
            e.stopPropagation();
          }
          selectRef.current?.focus?.();
        }
      }}
      value={value ?? []}
      allowClear
      {...rest}
      className={classNames('tz-tag-select', className)}
      ref={selectRef}
      mode="tags"
      suffixIcon={false}
      dropdownStyle={{ display: 'none' }}
      removeIcon={<i className="icon iconfont icon-close" />}
    />
  );
};

export default TzTagSelect;
