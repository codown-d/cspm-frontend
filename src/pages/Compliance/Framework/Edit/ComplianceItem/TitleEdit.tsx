import { TzInput } from '@/components/lib/TzInput';
import { TzPopover } from '@/components/lib/TzPopover';
import { TzButton } from '@/components/lib/tz-button';
import { TzCheckbox } from '@/components/lib/tz-checkbox';
import TzSelect from '@/components/lib/tzSelect';
import { useIntl } from '@umijs/max';
import { useUpdateEffect } from 'ahooks';
import { InputRef, Space } from 'antd';
import classNames from 'classnames';
import {
  FormEvent,
  Key,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useNodeEvent from './useNodeEvent';

type EditTitleProps = {
  catalog: string;
  title?: string;
  validateFail?: boolean;
  hasPolicy?: boolean;
  type: 'catalog' | 'requirement';
  onBlur: (arg?: any) => void;
  nodeKey: Key;
  // handleChange: (data: Omit<API_COMPLIANCE.ComplianceInfoData, 'key'>) => void;
};
function TitleEdit({
  catalog,
  title,
  // handleChange,
  onBlur,
  type,
  validateFail,
  hasPolicy,
  nodeKey,
}: EditTitleProps) {
  const intl = useIntl();
  const [changedOpen, setChangedOpen] = useState<boolean>();
  const [tempType, setTempType] = useState<string>();
  const [tip, setTip] = useState<boolean>();
  const [value, setValue] = useState<string | undefined>(title);
  const inputRef = useRef<InputRef>(null);
  const btnRef = useRef(null);
  const {
    setHideTypeSwitchTip,
    handleTitleChange,
    hideTypeSwitchTip,
    handleTypeChange,
  } = useNodeEvent();
  useUpdateEffect(() => {
    inputRef.current?.focus();
  }, [type]);
  const optionData = useMemo(
    () => [
      {
        label: catalog,
        value: 'catalog',
      },
      {
        label: intl.formatMessage({ id: 'complianceRequirement' }),
        value: 'requirement',
      },
    ],
    [catalog],
  );
  useEffect(() => {
    tempType && btnRef.current?.click();
  }, [tempType]);

  const hide = () => {
    setTempType(undefined);
    setChangedOpen(false);
  };
  const onOk = () => {
    setHideTypeSwitchTip(tip);
    tempType && handleTypeChange(nodeKey, tempType);
    hide();
  };

  const showTip = !hideTypeSwitchTip && hasPolicy;
  const label =
    type ===
    intl.formatMessage({
      id: 'catalog' ? 'directoryName' : 'complianceRequirementName',
    });
  return (
    <>
      <TzInput
        placeholder={intl.formatMessage({ id: 'txtTips' }, { name: label })}
        className={classNames({ error: validateFail })}
        style={{ width: 648 }}
        ref={inputRef}
        value={value}
        onChange={(e: FormEvent<HTMLInputElement>) => {
          const _v = (e.target as any).value;
          setValue(_v);
          handleTitleChange(nodeKey, { title: _v });
        }}
        maxLength={200}
        count={{
          show: true,
          max: 200,
        }}
        onPressEnter={onBlur}
        addonBefore={
          <TzSelect
            style={{ minWidth: 80 }}
            dropdownStyle={{ minWidth: 100 }}
            showSearch={false}
            popupClassName="tz-input-fitler-select-dropdown"
            value={type}
            onChange={(v) => {
              showTip
                ? setTempType(v)
                : handleTitleChange(nodeKey, { type: v });
            }}
            className="select-after"
            popupMatchSelectWidth={false}
            options={optionData}
            // getPopupContainer={(n) => n}
          />
        }
      />
      {showTip && (
        <TzPopover
          overlayClassName="node-opr-tip"
          overlayStyle={{ width: 300 }}
          content={
            <div className="px-1">
              <div className="flex">
                <i className="icon iconfont icon-jinggao mr-[6px] text-[#FF8A34]" />
                <span>
                  {intl.formatMessage({ id: 'unStand.switchNodeTip' })}
                </span>
              </div>
              <div className="flex justify-between items-center mt-3">
                <TzCheckbox
                  onChange={(e) => setTip(e.target.checked)}
                  className="text-[#6C7480]"
                >
                  {intl.formatMessage({ id: 'noMoreReminders' })}
                </TzCheckbox>
                <Space size={6}>
                  <TzButton
                    className="cancel-btn"
                    size="small"
                    // type="text"
                    onClick={hide}
                  >
                    {intl.formatMessage({ id: 'cancel' })}
                  </TzButton>
                  <TzButton size="small" type="primary" onClick={onOk}>
                    {intl.formatMessage({ id: 'switch' })}
                  </TzButton>
                </Space>
              </div>
            </div>
          }
          //   title="Click title"
          trigger="click"
          open={!hideTypeSwitchTip && changedOpen}
          onOpenChange={(e) => {
            setChangedOpen(e);
            !e && setTempType(undefined);
          }}
          // getPopupContainer={(n) => n}
          //   getPopupContainer={}
        >
          <div className="bg-lime-200 w-24 h-0 absolute " ref={btnRef}></div>
        </TzPopover>
      )}
      {/* {validateFail && <div className="tit-require">{label}不能为空</div>} */}
    </>
  );
}

export default memo(TitleEdit);
