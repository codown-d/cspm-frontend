import { TzButton } from '@/components/lib/tz-button';
import { verifyPolicy } from '@/services/cspm/Risks';
import { useIntl, useModel } from '@umijs/max';
import { useMemoizedFn, useUpdateEffect } from 'ahooks';
import { message } from 'antd';
import { memo, useState } from 'react';
import RectifyComplianceRes from '../RectifyComplianceRes';

type IActionNode = {
  record: API_RISK.VerifyPolicyRequest & {
    policy_type?: string;
    isCloudHost?: boolean;
  };
  calFn?: VoidFunction;
};
const ActionNodeWithVerify = ({ record, calFn }: IActionNode) => {
  const intl = useIntl();
  const [verify, setVerify] = useState<boolean>();
  const { taskSocketAction } = useModel('global');

  useUpdateEffect(() => {
    setVerify(false);
  }, [JSON.stringify(record)]);

  const { policy_type, ...restRecord } = record ?? {};
  const handlePolicyVerify = useMemoizedFn(() => {
    verifyPolicy(restRecord).then(() => {
      // calFn();
      setVerify(true);
      taskSocketAction?.setTrue();
      message.success(intl.formatMessage({ id: 'unStand.verifySuccess' }));
    });
  });
  if (!record) {
    return;
  }

  return policy_type === 'manual' ? (
    <div className="-ml-2" onClick={(e) => e.stopPropagation()}>
      <RectifyComplianceRes
        record={restRecord}
        calFn={() => {
          calFn?.();
          message.success(intl.formatMessage({ id: 'unStand.rectifySuccess' }));
        }}
      />
    </div>
  ) : (
    <TzButton
      className="-ml-2"
      size="small"
      type="text"
      onClick={(e) => {
        e.stopPropagation();
        // if (verify) {
        //   return;
        // }
        handlePolicyVerify();
      }}
      // icon={verify ? <LoadingOutlined className="mb-[3px]" /> : undefined}
    >
      {intl.formatMessage({ id: 'verify' })}
      {/* {intl.formatMessage({ id: verify ? 'inVerification' : 'verify' })} */}
    </TzButton>
  );
};
export default memo(ActionNodeWithVerify);
