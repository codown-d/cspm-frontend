import useAddTaskAnimation from '@/components/AddTaskAnimation';
import InfoAlert from '@/components/InfoAlert';
import TzModalForm from '@/components/lib/ProComponents/TzModalForm';
import { TzButton } from '@/components/lib/tz-button';
import useCredentials from '@/hooks/useCredentials';
import useEffectivePlatform from '@/hooks/useEffectivePlatform';
import { useRegion } from '@/hooks/useRegion';
import useServiceTree from '@/hooks/useServiceTree';
import { getCascaderIds } from '@/pages/CloudPlatform/util';
import { credentialsScan } from '@/services/cspm/CloudPlatform';
import { LoadingOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Form } from 'antd';
import { cloneDeep, get, set } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import RegionDetail from './RegionDetail';
import ScanConfig from './ScanConfig';
import styles from './index.less';

export type ScanModalProps = {
  open: boolean;
  onCancel: () => void;
  id?: string;
};
function ScanModal({ open, onCancel }: ScanModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>();
  const intl = useIntl();
  const valuesIsChangedRef = useRef<boolean>();
  const [visible, setVisible] = useState<boolean>(() => open);

  const agentlessRegions = useRegion(undefined, 'agentless');
  const agentlessPlatforms = useEffectivePlatform('agentless');
  const agentlessCredentials = useCredentials('agentless');
  const regions = useRegion();
  const platforms = useEffectivePlatform('user');
  const credentials = useCredentials();
  const services = useServiceTree(undefined, 1);
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
  const agentlessCascaderMap = useMemo(
    () => ({
      region_ids: agentlessRegions,
      platforms: agentlessPlatforms,
      credential_ids: agentlessCredentials,
    }),
    [agentlessRegions, agentlessPlatforms, agentlessCredentials],
  );

  const onOk = useMemoizedFn(async () => {
    try {
      const val = await form.validateFields();
      const newVal = cloneDeep(val);
      const { scan_type } = newVal;

      const getScanRes = (
        formVals: API.CredentialsScanResRequest,
        scanType: string,
      ) => {
        const fieldName = get(formVals, `${scanType}.detect_type`);
        const fieldVal = fieldName && get(formVals, [scanType, fieldName]);
        if (!fieldName || !fieldVal) {
          return;
        }
        if (['region_ids', 'service_ids'].includes(fieldName)) {
          set(
            formVals,
            [scanType, fieldName],
            getCascaderIds(
              fieldVal,
              get(
                scanType === 'agentless_config'
                  ? agentlessCascaderMap
                  : cascaderMap,
                fieldName,
              ),
            ),
          );
        }
      };

      scan_type.includes('config') && getScanRes(newVal, 'config_config');
      scan_type.includes('agentless') && getScanRes(newVal, 'agentless_config');

      setLoading(true);
      await credentialsScan(newVal as API.CredentialsScanResRequest);
      setLoading(false);
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
        className: styles.scanModal,
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

      <ScanConfig
        showAddBaseLine
        form={form}
        cascaderMap={cascaderMap}
        agentlessCascaderMap={agentlessCascaderMap}
      />
    </TzModalForm>
  );
}

export default ScanModal;
