import { TCommonPlatforms } from '@/interface';
import { useIntl } from '@umijs/max';
import { Checkbox, CheckboxProps } from 'antd';
import classNames from 'classnames';
import { memo } from 'react';
import RenderPIcon from '../RenderPIcon';
import './index.less';

type IPlatformCheckbox = Omit<CheckboxProps, 'onChange'> & {
  className?: string;
  value?: string[];
  options?: TCommonPlatforms[];
  onChange?: (checkedValue?: string[]) => void;
};
function PlatformCheckbox({
  onChange,
  className,
  value,
  options,
}: IPlatformCheckbox) {
  const intl = useIntl();
  return (
    <div
      className={classNames(
        'platform-checkbox ml-3 flex items-center',
        className,
      )}
    >
      <span className="text-xs">{intl.formatMessage({ id: 'scope' })}：</span>
      <Checkbox.Group
        options={options?.map((item) => ({
          label: (
            <div className="inline-flex items-center gap-[6px]">
              <RenderPIcon platform={item.value} />
              <span>{item.label}</span>
            </div>
          ),
          value: item.value,
        }))}
        value={value}
        // @ts-ignore
        onChange={onChange}
      />
    </div>
  );
}

export default memo(PlatformCheckbox);
