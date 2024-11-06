import TzSelect, { TzSelectProps } from '@/components/lib/tzSelect';
import translate from '@/locales/translate';
import classNames from 'classnames';
import { get, isEqual } from 'lodash';
import { useMemo } from 'react';
import SelectAllTagRender from '../SelectAllTagRender';
import styles from './index.less';
type CusSelectWithAllProps = TzSelectProps & {
  allLabel?: string;
  allowAllClear?: boolean;
};
function CusSelectWithAll({
  className,
  onChange,
  value,
  options,
  allLabel = translate('all'),
  maxTagCount = 2,
  allowAllClear,
  ...restProps
}: CusSelectWithAllProps) {
  const isAll = useMemo(
    () => isEqual(options?.map((v) => v.value)?.sort(), value?.sort()),
    [value],
  );
  const acountLen = options?.length;
  return (
    <TzSelect
      mode="multiple"
      className={classNames(styles.customeSelectWithAll, className)}
      showSearch={false}
      maxTagCount={isAll ? acountLen : maxTagCount}
      value={value}
      onChange={onChange}
      options={options}
      tagRender={(item) => (
        <SelectAllTagRender
          allowAllClear={allowAllClear}
          item={item}
          isAll={isAll}
          firVal={get(options, [0, 'value'])}
          allLabel={allLabel}
          onClear={() => onChange?.([], [])}
        />
      )}
      {...restProps}
    />
  );
}

export default CusSelectWithAll;
