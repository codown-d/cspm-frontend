import { TzInput } from '@/components/lib/TzInput';
import { TzInputPassword } from '@/components/lib/tz-input-password';
import { useMemoizedFn } from 'ahooks';
import { useRef } from 'react';
import {useIntl} from '@umijs/max';

type TPasswordControll = {
  onChange?: (val: string) => void;
  value?: string;
  placeholder?: string;
  isPwd?: boolean;
  disabled?: boolean;
};
function PasswordControll({
  onChange,
  value,
  placeholder,
  isPwd = true,
  disabled,
}: TPasswordControll) {
  const inputRef = useRef<boolean>();
  const intl = useIntl();

  const handleChange = useMemoizedFn((e) => {
    const val = e.target.value;
    if (!val.length) {
      onChange?.(val);
      return;
    }
    let _val: string[] = [];
    val.split('').forEach((element: string) => {
      if (/[a-zA-Z]|[\d]|(?=.*[-_])/.test(element)) {
        _val.push(element);
      }
    });
    onChange?.(_val.join(''));
  });
  const Node = isPwd ? TzInputPassword : TzInput;
  return (
    <Node
      disabled={disabled}
      autoComplete="off"
      allowClear
      maxLength={50}
      value={value}
      onChange={(e) => {
        inputRef.current = true;
        handleChange(e);
      }}
      placeholder={
        placeholder ?? `${intl.formatMessage({ id: 'txtTips' }, { name: '' })}`
      }
    />
  );
}

export default PasswordControll;
