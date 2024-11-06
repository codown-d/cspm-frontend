import useAddTaskAnimation from '@/components/AddTaskAnimation';
import InfoAlert from '@/components/InfoAlert';
import TzModalForm from '@/components/lib/ProComponents/TzModalForm';
import TzProForm from '@/components/lib/ProComponents/TzProForm';
import { TzButton } from '@/components/lib/tz-button';
import { transFilterData2Params } from '@/pages/CloudPlatform/util';
import RegionDetail from '@/pages/Risks/components/ScanModal/RegionDetail';
import { assetsScan } from '@/services/cspm/CloudPlatform';
import { LoadingOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Form, message } from 'antd';
import { get } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import ScanScope, { IScanScope } from './ScanScope';
import ScanTypeFormItem from './ScanTypeFormItem';

export type ScanModalProps = {
  open: boolean;
  onCancel: () => void;
  id?: string;
  ScanScopeObj: IScanScope;
  scanFilterData?: any;
  hostAssetExisted?: boolean;
};
function ScanModal({
  open,
  onCancel,
  ScanScopeObj,
  hostAssetExisted,
}: ScanModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>();
  const intl = useIntl();
  const valuesIsChangedRef = useRef<boolean>();
  const [visible, setVisible] = useState<boolean>(() => open);

  const startRef = useRef();
  const aRef = useAddTaskAnimation(startRef);

  const onOk = useMemoizedFn(async () => {
    try {
      const { scan_types, filter } = await form.validateFields();

      const vals = transFilterData2Params(
        filter,
        get(ScanScopeObj, 'filterItems'),
        true,
      ) as Omit<API.AssetsScanRequest, 'scan_types'>;
      setLoading(true);
      await assetsScan({ ...vals, scan_types: scan_types ?? ['config'] });
      setLoading(false);
      message.success(
        intl.formatMessage({ id: 'unStand.scanLaunchSuccessfully' }),
      );
      aRef.running();
      onCancel();
    } catch (e) {
      setLoading(false);
    }
  });
  useEffect(() => {
    setTimeout(() => {
      visible && startRef.current && aRef.refreshMount(startRef.current);
    }, 1000);
  }, [visible]);

  return (
    <TzModalForm
      form={form}
      width={560}
      title={intl.formatMessage({ id: 'initiateScan' })}
      open={visible}
      submitter={{
        render: () => [
          !loading && (
            <TzButton className="cancel-btn" key="cancel" onClick={onCancel}>
              {intl.formatMessage({ id: 'cancel' })}
            </TzButton>
          ),
          <TzButton
            disabled={loading}
            key="submit"
            type="primary"
            onClick={onOk}
            ref={startRef}
          >
            {loading ? (
              <>
                <LoadingOutlined />
                &nbsp; {intl.formatMessage({ id: 'scaning' })}
              </>
            ) : (
              intl.formatMessage({ id: 'scan' })
            )}
          </TzButton>,
        ],
      }}
      modalProps={{
        onCancel,
        closable: !loading,
        maskClosable: false,
      }}
      onValuesChange={() => (valuesIsChangedRef.current = true)}
    >
      <InfoAlert
        className="mb-3"
        tip={
          <>
            {intl.formatMessage({ id: 'unStand.detectInfoPrev' })}
            <RegionDetail setScanVisible={setVisible} />
            {intl.formatMessage({ id: 'unStand.detectInfoNext' })}
          </>
        }
      />

      <TzProForm.Item
        name="filter"
        label={intl.formatMessage({ id: 'scanObject' })}
        rules={[
          {
            required: true,
            message: intl.formatMessage(
              { id: 'requiredTips' },
              { name: intl.formatMessage({ id: 'detectContent' }) },
            ),
          },
        ]}
      >
        <ScanScope {...ScanScopeObj} />
      </TzProForm.Item>
      {!!hostAssetExisted && <ScanTypeFormItem className="mt-4" />}
    </TzModalForm>
  );
}

export default ScanModal;
