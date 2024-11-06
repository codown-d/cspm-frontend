import TzModalForm from '@/components/lib/ProComponents/TzModalForm';
import TzTagSelect from '@/components/lib/TzTagSelect';
import TzSelect from '@/components/lib/tzSelect';
import { useSeverityEnum } from '@/hooks/enum/useSeverityEnum';
import useServiceTree from '@/hooks/useServiceTree';
import { NONE_PLATFORM } from '@/utils';
import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Form } from 'antd';
import { get, set } from 'lodash';
import { useMemo } from 'react';
import styles from './index.less';

type LicenseModalProps = {
  onCancel?: () => void;
  onOk: (data: API.CommonPolicyItem) => void;
  record?: API.CommonPolicyItem;
};
const CusPolicy = ({ onCancel, onOk, record }: LicenseModalProps) => {
  const [form] = Form.useForm<API.CommonPolicyItem>();
  const intl = useIntl();

  const { initialState } = useModel('@@initialState');
  const { commonPlatforms } = initialState ?? {};
  const serviceTree = useServiceTree() as API.CommonServicetreeResponse[];

  const platform = Form.useWatch(['platform'], form);
  const { riskSeverityOption } = useSeverityEnum();

  const services = useMemo(
    () => serviceTree?.find((item) => item.value === platform)?.children || [],
    [platform, serviceTree],
  );

  const getFieldProps = useMemoizedFn((name, labelId, type?) => {
    const label = intl.formatMessage({ id: labelId });
    return {
      name,
      label,
      placeholder: intl.formatMessage(
        { id: type === 'select' ? 'selectTips' : 'txtTips' },
        { name: label },
      ),
      allowClear: true,
      rules: [
        {
          required: true,
          message: intl.formatMessage({ id: 'requiredTips' }, { name: label }),
        },
      ],
    };
  });
  const initialPlatform = get(record, 'platform');

  return (
    <TzModalForm
      form={form}
      width={560}
      title={intl.formatMessage({
        id: 'customDetectionItems',
      })}
      initialValues={{
        ...record,
        platform:
          !initialPlatform || initialPlatform === NONE_PLATFORM
            ? undefined
            : initialPlatform,
      }}
      open
      submitter={{
        searchConfig: {
          submitText: intl.formatMessage({
            id: 'ok',
          }),
        },
        resetButtonProps: { className: 'cancel-btn' },
      }}
      modalProps={{
        onCancel,
        maskClosable: false,
        destroyOnClose: true,
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      onFinish={async (val: API.CommonPolicyItem) => {
        try {
          const _val = {
            ...val,
            platform: val.platform ?? NONE_PLATFORM,
          };
          const _assetTypeId = val.asset_type_id;
          if (_assetTypeId) {
            const _item = services.find((item) => item.id === _assetTypeId);
            set(_val, 'asset_type_name', _item?.label);
            set(_val, 'service_id', _item?.top_service);
            set(_val, 'service_name', _item?.top_service_name);
          }
          await onOk(_val);
          onCancel?.();
          return true;
        } catch (error) {
          return false;
        }
      }}
    >
      <ProFormText
        fieldProps={{
          maxLength: 100,
          count: {
            show: true,
            max: 100,
          },
        }}
        {...getFieldProps('policy_title', 'policies')}
      />
      {/* <ProFormSelect
        options={commonPlatforms}
        onChange={(v, x) => {
          form.setFieldValue('service_id', undefined);
        }}
        {...getFieldProps('platform', 'cloudPlatformBelongs', 'select')}
        required={false}
        rules={undefined}
      /> */}
      <ProForm.Item
        {...getFieldProps('platform', 'cloudPlatformBelongs', 'select')}
        required={false}
        rules={undefined}
      >
        <TzSelect
          options={commonPlatforms}
          showSearch
          onChange={(v, x) => {
            form.setFieldValue('asset_type_id', undefined);
          }}
          allowClear
        />
      </ProForm.Item>
      {/* <ProFormSelect
        options={services}
        {...getFieldProps('service_id', 'cloudServices', 'select')}
        required={false}
        showSearch
        rules={undefined}
      /> */}
      <ProForm.Item
        {...getFieldProps('asset_type_id', 'assetClass', 'select')}
        required={false}
        rules={undefined}
      >
        <TzSelect options={services} showSearch allowClear />
      </ProForm.Item>

      <ProFormSelect
        options={riskSeverityOption}
        {...getFieldProps('severity', 'severityLevel', 'select')}
      />
      <ProFormTextArea
        {...getFieldProps('description', 'concreteContent')}
        fieldProps={{
          maxLength: 800,
          count: {
            show: true,
            max: 800,
          },
        }}
      />
      <ProFormTextArea
        {...getFieldProps('mitigation', 'suggestionRepair')}
        fieldProps={{
          maxLength: 800,
          count: {
            show: true,
            max: 800,
          },
        }}
      />
      <ProForm.Item
        {...getFieldProps('references', 'referenceLinking', 'select')}
        rules={undefined}
        required={false}
      >
        <TzTagSelect
          placeholder={intl.formatMessage({
            id: 'unStand.customerLinkTip',
          })}
          className={styles.customerLink}
        />
      </ProForm.Item>
    </TzModalForm>
  );
};
export default CusPolicy;
