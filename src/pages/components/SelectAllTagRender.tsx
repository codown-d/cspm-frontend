import { TzTag } from '@/components/lib/tz-tag';
import translate from '@/locales/translate';
import { Key, useMemo } from 'react';
type SelectAllTagRenderProps = {
  item: any;
  isAll: boolean;
  firVal: Key;
  allLabel?: string;
  allowAllClear?: boolean;
  onClear?: VoidFunction;
};
function SelectAllTagRender({
  item,
  isAll,
  firVal,
  allowAllClear = false,
  onClear,
  allLabel = translate('all'),
}: SelectAllTagRenderProps) {
  const RenderTag = useMemo(() => {
    const tagProps = allowAllClear
      ? {
          closable: true,
          className: 'tz-select-selection-item',
          closeIcon: 'icon iconfont icon-close',
        }
      : { className: 'tz-select-selection-item' };
    if (isAll) {
      if (item.value === firVal) {
        return (
          <TzTag size="small" onClose={onClear} {...tagProps}>
            {allLabel}
          </TzTag>
        );
      }
      return '';
    }

    return (
      <TzTag size="small" onClose={item.onClose} {...tagProps}>
        {item.label}
      </TzTag>
    );
  }, [item, isAll, firVal, allowAllClear]);

  return RenderTag;
}

export default SelectAllTagRender;
