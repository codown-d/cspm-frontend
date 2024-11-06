import useAddTaskAnimation from '@/components/AddTaskAnimation';
import InfoAlert from '@/components/InfoAlert';
import TzModalForm from '@/components/lib/ProComponents/TzModalForm';
import { TzButton } from '@/components/lib/tz-button';
import ScanTypeFormItem from '@/pages/Asset/ScanModal/ScanTypeFormItem';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { ButtonProps, Form } from 'antd';
import { useRef } from 'react';

export type IScanSingleAsset = {
  onOpenChange?: (open: boolean) => void;
  onFinish?: (
    arg: Pick<API.AssetsScanRequest, 'scan_types'>,
  ) => Promise<true | undefined>;
  btnPops?: ButtonProps;
  scanParams?: Omit<API.AssetsScanRequest, 'scan_types'>;
};
function ScanSingleAsset({
  onOpenChange,
  btnPops,
  scanParams,
  onFinish,
}: IScanSingleAsset) {
  const [form] = Form.useForm();
  const intl = useIntl();
  const startRef = useRef();
  const aRef = useAddTaskAnimation(startRef);

  const onOk = useMemoizedFn(async () => {
    try {
      const { scan_types } = await form.validateFields();
      // await assetsScan({
      //   scan_types,
      //   // instance_hash_ids: [hash_id],
      //   // platforms: [platform],
      //   ...scanParams,
      // } as unknown as API.AssetsScanRequest);
      await onFinish?.({ scan_types });
      aRef.running();
      // message.success(intl.formatMessage({ id: 'unStand.startScan' }));
      return true;
    } catch (e) {
      console.error(e);
    }
  });
  return (
    <TzModalForm
      form={form}
      width={560}
      title={intl.formatMessage({ id: 'initiateScan' })}
      trigger={
        <TzButton
          {...btnPops}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {intl.formatMessage({ id: 'scan' })}
        </TzButton>
      }
      onOpenChange={(o) => {
        setTimeout(() => {
          o && aRef.refreshMount(startRef.current!);
        });
        onOpenChange?.(o);
      }}
      submitter={{
        searchConfig: {
          resetText: intl.formatMessage({ id: 'cancel' }),
          submitText: intl.formatMessage({ id: 'scan' }),
        },
      }}
      onFinish={onOk}
      modalProps={{
        maskClosable: false,
        destroyOnClose: true,
      }}
      initialValues={{
        scan_type: 'platform',
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <InfoAlert
        className="mb-3"
        tip={intl.formatMessage({ id: 'unStand.agentlessScanTip' })}
      />
      <ScanTypeFormItem />
      <span className="absolute right-8 bottom-6" ref={startRef} />
    </TzModalForm>
  );
}

export default ScanSingleAsset;
