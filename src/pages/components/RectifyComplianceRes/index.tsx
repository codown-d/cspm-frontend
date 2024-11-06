import { TzButton } from '@/components/lib/tz-button';
import { TzPopover } from '@/components/lib/TzPopover';
import { useState } from 'react';

import { rectifyPolicyResult } from '@/services/cspm/Compliance';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Space } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
type IRectifyComplianceRes = {
  calFn?: VoidFunction;
  btnTxt?: string;
  record: Omit<API_COMPLIANCE.RectifyPolicyResultRequest, 'result'>;
};
function RectifyComplianceRes({
  calFn,
  btnTxt,
  record,
}: IRectifyComplianceRes) {
  const intl = useIntl();
  const [clicked, setClicked] = useState(false);
  const onOk = useMemoizedFn((result) => {
    rectifyPolicyResult({ result, ...record }).then(calFn);
    setClicked(false);
  });
  const handleClickChange = (open: boolean) => {
    setClicked(open);
  };

  return (
    <TzPopover
      overlayClassName={classNames('node-opr-tip', styles.rectifyComplianceRes)}
      overlayStyle={{ width: 240 }}
      content={
        <div className="px-1">
          <div className="absolute right-3 top-2">
            <i className="icon iconfont cursor-pointer icon-close text-[#B3BAC6] hover:bg-[rgba(33, 119, 209, 0.05)] hover:text-[#2177d1]" />
          </div>
          <div className="flex items-center">
            <i className="icon iconfont icon-jinggao mr-[6px] text-[#FF8A34]" />
            <span>更正检测结果</span>
          </div>
          <div className="flex justify-end items-center mt-3">
            <Space size={6}>
              <TzButton
                style={{ background: '#52C41A' }}
                type="primary"
                size="small"
                className={styles.passBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onOk('passed');
                }}
              >
                {intl.formatMessage({ id: 'toPass' })}
              </TzButton>
              <TzButton
                size="small"
                type="primary"
                danger
                onClick={(e) => {
                  e.stopPropagation();
                  onOk('unpassed');
                }}
              >
                {intl.formatMessage({ id: 'toNoPass' })}
              </TzButton>
              <TzButton
                style={{ background: '#F9A363' }}
                className={styles.warnBtn}
                type="primary"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onOk('warn');
                }}
              >
                {intl.formatMessage({ id: 'toWarning' })}
              </TzButton>
            </Space>
          </div>
        </div>
      }
      trigger="click"
      open={clicked}
      onOpenChange={handleClickChange}
    >
      <TzButton size="small" type="text" onClick={(e) => e.stopPropagation()}>
        {btnTxt ?? intl.formatMessage({ id: 'rectify' })}
      </TzButton>
    </TzPopover>
  );
}

export default RectifyComplianceRes;
