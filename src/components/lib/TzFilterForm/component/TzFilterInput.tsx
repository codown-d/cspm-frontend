import { InputRef, Popover, Typography } from 'antd';
import { isString } from 'lodash';
import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { TzInput } from '../../TzInput';
import { TzTooltip } from '../../tz-tooltip';
import { TWids } from '../RederValueTxt';
import { FilterInput } from '../filterInterface';

export type TTzFilterInput = Omit<FilterInput, 'icon' | 'type'> &
  FilterInput['props'] & {
    wids?: TWids;
    onDropdownVisibleChange?: (value: boolean) => void;
  };
const TzFilterInput = ({
  value,
  onChange,
  onDropdownVisibleChange,
  name,
  wids,
  isTag,
}: TTzFilterInput) => {
  const [open, setOpen] = useState(false);
  const [inputV, setInputV] = useState<TTzFilterInput['value']>(value);
  const txtRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<InputRef>(null);

  const handleOpenChange = (newOpen: boolean) => {
    newOpen ? setInputV(value) : onChange?.(inputV);
    setOpen(newOpen);
    newOpen && inputRef.current?.focus();
    onDropdownVisibleChange?.(newOpen);
  };

  const tooltipTit = useMemo(() => {
    let tit: TTzFilterInput['value'] = '';
    if (wids?.[name] && wids?.[name] > 190) {
      tit = value || '';
    }
    return tit;
  }, [value, name, wids]);

  return (
    <Popover
      open={open}
      overlayClassName="tz-form-item-input-overlay"
      content={
        <div ref={txtRef}>
          <TzInput
            autoFocus
            ref={inputRef}
            value={inputV}
            bordered={false}
            className="tz-form-item-input"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setInputV(e.target.value)
            }
            maxLength={100}
            onPressEnter={() => handleOpenChange(false)}
            addonAfter={
              <i
                onClick={(e) => setInputV(undefined)}
                className="icon iconfont tz-icon tz-form-item-input-clear icon-clear"
              />
            }
          />
        </div>
      }
      placement="bottomLeft"
      title={false}
      trigger="click"
      onOpenChange={handleOpenChange}
      // getPopupContainer={(n) => txtRef.current ?? n}
    >
      <TzTooltip className="tz-form-item-input-txt" title={tooltipTit}>
        <Typography.Text>
          {isTag && isString(value) ? value.replace(/[\uff0c]/g, ',') : value}
        </Typography.Text>
      </TzTooltip>
    </Popover>
  );
};

export default TzFilterInput;
