import { get, merge } from 'lodash';
import { useMemo } from 'react';
import TzTypography from '../lib/TzTypography';
import TzSelect, { TzSelectProps } from '../lib/tzSelect';
import './index.less';

export type TagSelectProps = TzSelectProps & {
  label: string;
  value: any[];
  // clearable?: boolean;
  removeTag?: (arg: string) => void;
};
function TagSelect(props: TagSelectProps) {
  const {
    label,
    value,
    options,
    // clearable = true,
    removeTag,
    ...restSelectProps
  } = props;
  const rTag = useMemo(() => {
    const _opt = options?.filter(
      (v) => v.value === value || value.includes(v.value),
    );
    const len = _opt?.length ?? 0;
    return _opt?.map((item, index) => (
      <>
        <div className="max-w-[30vw] inline-block">
          <TzTypography.Text>{item.label}</TzTypography.Text>
        </div>
        {len - 1 > index ? '，' : ''}
      </>
    ));
  }, [options]);
  return (
    <div className="inline-flex px-1 leading-6 tag-select rounded bg-[rgba(33,119,209,0.05)] gap-1">
      <span className="pl-1 text-nowrap">{label}</span>
      <span>:</span>
      {/* {!!removeTag ? (
        <TzSelect
          showSearch={false}
          className="max-w-[30vw]"
          options={options}
          // maxTagCount="responsive"
          value={value}
          {...restSelectProps}
        />
      ) : (
        <>{rTag}</>
      )} */}
      <TzSelect
        showSearch={false}
        className="max-w-[30vw]"
        options={options}
        // maxTagCount="responsive"
        value={value}
        {...restSelectProps}
        mode={removeTag ? get(restSelectProps, 'mode') : 'tags'}
        dropdownStyle={merge(
          {},
          removeTag ? undefined : { display: 'none' },
          restSelectProps.dropdownStyle,
        )}
      />
      {!!removeTag && (
        <div
          className="hover:bg-[rgba(33,119,209,0.05)] px-[5px] h-6 cursor-pointer "
          onClick={() => {
            removeTag(label);
          }}
        >
          <i className="icon iconfont tz-icon icon-close tz-close-icon text-base" />
        </div>
      )}
    </div>
  );
}

export default TagSelect;
