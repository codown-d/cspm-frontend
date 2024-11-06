import useAddTaskAnimation from '@/components/AddTaskAnimation';
import InfoAlert from '@/components/InfoAlert';
import TzModalForm from '@/components/lib/ProComponents/TzModalForm';
import TzProFormCheckbox from '@/components/lib/ProComponents/TzProFormCheckbox';
import { TzPopover } from '@/components/lib/TzPopover';
import { TzButton } from '@/components/lib/tz-button';
import { assetsScan } from '@/services/cspm/CloudPlatform';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Form, message } from 'antd';
import { useMemo, useRef } from 'react';
import styles from '../../../Risks/components/ScanModal/index.less';

export type AgentlessScanModalProps = {
  hash_id?: string;
  tip?: string;
  agentlessScannable?: boolean;
  isRiskScan?: boolean;
  fetchUrl?: Function;
  credentialId?: number;
};
function AgentlessScanModal(props: AgentlessScanModalProps) {
  const { hash_id, agentlessScannable, tip, credentialId } = props;
  const [form] = Form.useForm();
  const intl = useIntl();
  const startRef = useRef();
  const aRef = useAddTaskAnimation(startRef);

  const onOk = useMemoizedFn(async () => {
    try {
      const { scan_types } = await form.validateFields();
      // set(newVal, ['agentless_config', 'instance_hash_ids'], [hash_id]);
      // set(newVal, ['agentless_config', 'credential_ids'], [credentialId]);
      await assetsScan({
        instance_hash_ids: [hash_id],
        credential_ids: [credentialId],
        scan_types,
      });
      aRef.running();
      message.success(
        intl.formatMessage({ id: 'unStand.scanLaunchSuccessfully' }),
      );
      return true;
    } catch (e) {
      console.error(e);
    }
  });
  const triggerBtn = useMemo(
    () => (
      <TzButton disabled={!agentlessScannable} ref={startRef}>
        {intl.formatMessage({ id: 'scan' })}
      </TzButton>
    ),
    [agentlessScannable],
  );
  return (
    <TzModalForm
      form={form}
      width={560}
      title={intl.formatMessage({ id: 'initiateAgentlessScan' })}
      trigger={
        agentlessScannable ? (
          triggerBtn
        ) : (
          <TzPopover
            placement="bottomRight"
            overlayClassName="render-tip-overlay"
            content={
              <div>
                {intl.formatMessage({ id: 'unStand.noSupportRegion' }, { tip })}
              </div>
            }
          >
            {triggerBtn}
          </TzPopover>
        )
      }
      submitter={{
        searchConfig: {
          resetText: intl.formatMessage({ id: 'cancel' }),
          submitText: intl.formatMessage({ id: 'scan' }),
        },
      }}
      onFinish={onOk}
      modalProps={{
        className: styles.scanModal,
        maskClosable: false,
        destroyOnClose: true,
      }}
    >
      <InfoAlert
        className="mb-4 -mt-[11px]"
        tip={intl.formatMessage({ id: 'unStand.agentlessScanTip' })}
      />
      <TzProFormCheckbox.Group
        name="scan_types"
        rules={[
          {
            required: true,
            message: intl.formatMessage(
              { id: 'requiredTips' },
              { name: intl.formatMessage({ id: 'agentlessScanContent' }) },
            ),
          },
        ]}
        formItemProps={{ style: { marginTop: 20 } }}
        label={intl.formatMessage({ id: 'agentlessScanContent' })}
        options={[
          {
            label: intl.formatMessage({ id: 'vuln' }),
            value: 'vuln',
          },
          {
            label: intl.formatMessage({ id: 'sensitive' }),
            value: 'sensitive',
          },
        ]}
      />
    </TzModalForm>
  );
}

export default AgentlessScanModal;
