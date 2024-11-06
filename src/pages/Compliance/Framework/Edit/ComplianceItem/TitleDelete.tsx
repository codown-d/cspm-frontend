import { TzButton } from '@/components/lib/tz-button';
import { TzPopover } from '@/components/lib/TzPopover';
import { useState } from 'react';

import { TzCheckbox } from '@/components/lib/tz-checkbox';
import { useIntl } from '@umijs/max';
import { Space } from 'antd';
type ITitleDelete = {
  // nodeKey: Key;
  hideDeleteTip: boolean;
  setHideDeleteTip: (hide: boolean) => void;
  onOk: () => void;
};
function TitleDelete({
  onOk: onOkProps,
  setHideDeleteTip,
  hideDeleteTip,
}: ITitleDelete) {
  const intl = useIntl();
  const [clicked, setClicked] = useState(false);
  const [tip, setTip] = useState<boolean>();

  const hide = () => {
    setClicked(false);
  };
  const onOk = () => {
    onOkProps();
    hide();
  };
  const handleClickChange = (open: boolean) => {
    setClicked(open);
  };
  return (
    <TzPopover
      overlayClassName="node-opr-tip"
      overlayStyle={{ width: 290 }}
      content={
        <div className="px-1">
          <div className="flex">
            <i className="icon iconfont icon-jinggao mr-[6px] text-[#FF8A34]" />
            <span>{intl.formatMessage({ id: 'unStand.deleteTips' })}</span>
          </div>
          <div className="flex justify-between items-center mt-3">
            <TzCheckbox onChange={(e) => setTip(e.target.checked)}>
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
              <TzButton
                size="small"
                type="primary"
                danger
                onClick={() => {
                  onOk();
                  setHideDeleteTip?.(!!tip);
                }}
              >
                {intl.formatMessage({ id: 'delete' })}
              </TzButton>
            </Space>
          </div>
        </div>
      }
      //   title="Click title"
      trigger="click"
      open={!hideDeleteTip && clicked}
      onOpenChange={handleClickChange}
      // getPopupContainer={(n) => n}
      //   getPopupContainer={}
    >
      <TzButton
        onClick={hideDeleteTip ? onOk : () => {}}
        danger
        size="small"
        type="text"
      >
        {intl.formatMessage({ id: 'delete' })}
      </TzButton>
    </TzPopover>
  );
}

export default TitleDelete;
