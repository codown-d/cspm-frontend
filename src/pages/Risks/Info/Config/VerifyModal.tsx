import TzModalForm from '@/components/lib/ProComponents/TzModalForm';
import TzProFormRadio from '@/components/lib/ProComponents/TzProFormRadio';
import { TzButton } from '@/components/lib/tz-button';
import { rectifyPolicyResult } from '@/services/cspm/Compliance';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Form, message } from 'antd';
import './index.less';

export type VerifyModalProps = {
  record: Omit<API_COMPLIANCE.RectifyPolicyResultRequest, 'result'>;
};
function VerifyModal({ record }: VerifyModalProps) {
  const intl = useIntl();
  const [form] = Form.useForm();

  const onOk = useMemoizedFn(async (val) => {
    try {
      await rectifyPolicyResult({ ...val, ...record });
      message.success(intl.formatMessage({ id: 'unStand.rectifySuccess' }));
      return true;
    } catch (e) {
      console.log(e);
    }
  });
  return (
    <TzModalForm
      form={form}
      width={560}
      title={intl.formatMessage({ id: 'rectify' })}
      trigger={<TzButton>{intl.formatMessage({ id: 'rectify' })}</TzButton>}
      submitter={{
        searchConfig: {
          resetText: intl.formatMessage({ id: 'cancel' }),
          submitText: intl.formatMessage({ id: 'rectify' }),
        },
      }}
      onFinish={onOk}
      modalProps={{
        maskClosable: false,
        destroyOnClose: true,
      }}
    >
      <TzProFormRadio.Group
        rules={[
          {
            required: true,
            message: intl.formatMessage(
              { id: 'requiredTips' },
              { name: intl.formatMessage({ id: 'rectifyRes' }) },
            ),
          },
        ]}
        name="result"
        label={intl.formatMessage({ id: 'rectifyRes' })}
        options={[
          {
            label: intl.formatMessage({ id: 'toPass' }),
            value: 'passed',
          },
          {
            label: intl.formatMessage({ id: 'toNoPass' }),
            value: 'unpassed',
          },
          {
            label: intl.formatMessage({ id: 'toWarning' }),
            value: 'warn',
          },
          // ].filter((v) => !isAgentless || v.value !== 'service_ids')}
        ]}
      />
    </TzModalForm>
  );
}

export default VerifyModal;
