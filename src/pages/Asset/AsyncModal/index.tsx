import useAddTaskAnimation from '@/components/AddTaskAnimation';
import TzModalForm from '@/components/lib/ProComponents/TzModalForm';
import { TzButton } from '@/components/lib/tz-button';
import useCredentials from '@/hooks/useCredentials';
import useEffectivePlatform from '@/hooks/useEffectivePlatform';
import { useRegion } from '@/hooks/useRegion';
import useServiceTree from '@/hooks/useServiceTree';
import { getCascaderIds } from '@/pages/CloudPlatform/util';
import { assetsScan } from '@/services/cspm/CloudPlatform';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Form, message } from 'antd';
import { cloneDeep, get, set } from 'lodash';
import { useMemo, useRef } from 'react';
import DetectType from '../../components/DetectType';
import './index.less';

export type AsyncModalProps = {
  triggerTxt?: string;
};
function AsyncModal(props: AsyncModalProps) {
  const { triggerTxt } = props;
  const [form] = Form.useForm();
  const intl = useIntl();
  const regions = useRegion();
  const services = useServiceTree(undefined, 1);
  const platforms = useEffectivePlatform('user');
  const credentials = useCredentials();
  const startRef = useRef();
  const aRef = useAddTaskAnimation(startRef);
  const cascaderMap = useMemo(
    () => ({
      region_ids: regions,
      service_ids: services,
      platforms,
      credential_ids: credentials,
    }),
    [regions, services, platforms, credentials],
  );

  const onOk = useMemoizedFn(async () => {
    try {
      const val = await form.validateFields();
      const newVal = cloneDeep(val);
      const { scan_type, ...rest } = newVal;

      const fieldName = get(rest, `detect_type`);
      const fieldVal = get(rest, [fieldName]);
      if (['region_ids', 'service_ids'].includes(fieldName)) {
        set(
          newVal,
          [fieldName],
          getCascaderIds(fieldVal, get(cascaderMap, fieldName)),
        );
      }
      await assetsScan(newVal as API.AssetsScanRequest);
      aRef.running();
      message.success(intl.formatMessage({ id: 'unStand.startAssetAsync' }));
      return true;
    } catch (e) {
      console.error(e);
    }
  });
  return (
    <TzModalForm
      form={form}
      width={560}
      title={intl.formatMessage({ id: 'manualSync' })}
      trigger={
        <TzButton ref={startRef} onClick={(e) => e.stopPropagation()}>
          {triggerTxt ?? intl.formatMessage({ id: 'manualSync' })}
        </TzButton>
      }
      submitter={{
        searchConfig: {
          resetText: intl.formatMessage({ id: 'cancel' }),
          submitText: intl.formatMessage({ id: 'sync' }),
        },
      }}
      onFinish={onOk}
      modalProps={{
        className: 'async-modal',
        maskClosable: false,
        destroyOnClose: true,
      }}
      initialValues={{
        scan_type: 'platform',
      }}
    >
      <DetectType
        label={intl.formatMessage({ id: 'syncMode' })}
        cascaderMap={cascaderMap}
        form={form}
      />
    </TzModalForm>
  );
}

export default AsyncModal;
