import useAddTaskAnimation from '@/components/AddTaskAnimation';
import TzModalForm from '@/components/lib/ProComponents/TzModalForm';
import TzProForm from '@/components/lib/ProComponents/TzProForm';
import { TzButton } from '@/components/lib/tz-button';
import TzSelect from '@/components/lib/tzSelect';
import DetectType, {
  DetectTypeCascaderMap,
} from '@/pages/components/DetectType';
import { complianceScan } from '@/services/cspm/Compliance';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Form } from 'antd';
import { useRef } from 'react';

export type ScanModalProps = {
  frameworkOpt?: API_COMPLIANCE.ComplianceOverviewItem[];
  cascaderMap: Pick<DetectTypeCascaderMap, 'platforms' | 'credential_ids'>;
};
function ScanModal({ cascaderMap, frameworkOpt }: ScanModalProps) {
  const [form] = Form.useForm();
  const intl = useIntl();
  const valuesIsChangedRef = useRef<boolean>();
  const startRef = useRef();
  const aRef = useAddTaskAnimation(startRef);

  const onOk = useMemoizedFn(async (vals) => {
    try {
      const { detect_type, ...sendData } = vals;
      await complianceScan(sendData);
      aRef.running();
      return true;
    } catch (e) {}
  });
  return (
    <TzModalForm
      form={form}
      width={560}
      title={intl.formatMessage({ id: 'initiateScan' })}
      submitter={{
        searchConfig: {
          submitText: intl.formatMessage({
            id: 'ok',
          }),
        },
        resetButtonProps: { className: 'cancel-btn' },
      }}
      modalProps={{
        maskClosable: false,
        destroyOnClose: true,
      }}
      trigger={
        <TzButton key="initiateScan">
          {intl.formatMessage({ id: 'initiateScan' })}
        </TzButton>
      }
      onFinish={onOk}
      onOpenChange={(o) => {
        setTimeout(() => {
          o && aRef.refreshMount(startRef.current!);
        });
      }}
      onValuesChange={() => (valuesIsChangedRef.current = true)}
    >
      <DetectType
        detectOmit={['service_ids', 'region_ids']}
        cascaderMap={cascaderMap}
        label={intl.formatMessage({ id: 'scanRange' })}
        form={form}
      />

      <TzProForm.Item
        className="benchmark-row"
        rules={[
          {
            required: true,
            message: intl.formatMessage(
              { id: 'requiredTips' },
              { name: intl.formatMessage({ id: 'scanRange' }) },
            ),
          },
        ]}
        label={intl.formatMessage({
          id: 'complianceFramework',
        })}
        name="compliance_ids"
      >
        <TzSelect
          mode="multiple"
          placeholder={intl.formatMessage(
            { id: 'selectTips' },
            {
              name: intl.formatMessage({
                id: 'complianceFramework',
              }),
            },
          )}
          allowClear
          className="w-full"
          fieldNames={{ label: 'label', value: 'key' }}
          options={frameworkOpt}
        />
      </TzProForm.Item>
      <span className="absolute right-8 bottom-6" ref={startRef} />
    </TzModalForm>
  );
}

export default ScanModal;
