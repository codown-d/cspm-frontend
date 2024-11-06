import InfoAlert from '@/components/InfoAlert';
import { TzModalProps } from '@/components/lib/tzModal';
import { ProFormText } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Form, FormInstance, message } from 'antd';
import dayjs from 'dayjs';
import React, { useRef } from 'react';
import useAddTaskAnimation from '../AddTaskAnimation';
import TzModalForm from '../lib/ProComponents/TzModalForm';
import { TzProFormProps } from '../lib/ProComponents/TzProForm';
import { TzButton } from '../lib/tz-button';

export interface ExportModalProps extends TzModalProps {
  tip?: string;
  renderTrigger?: JSX.Element;
  formItem?: React.ReactNode;
  modalFormProps?: TzProFormProps;
  onSubmit?: (formValue: Record<string, any>) => Promise<any | undefined>;
  onOpenChange?: (open: boolean, form: FormInstance) => void;
  disabled?: boolean;
}
export interface IRef {
  form: any;
  open: () => void;
}

export const getExportNameTimeSuffix = () => dayjs().format('YYYYMMDDHHmmss');
export const mixFileName = (fileName: string) =>
  `${fileName}_${getExportNameTimeSuffix()}`.replaceAll(
    /[\(\)\（\）\s/@!?？——@#$%^&*()<>\[\]:./\\]/g,
    '_',
  );

const ExportModal = (props: ExportModalProps) => {
  const {
    renderTrigger,
    onSubmit,
    tip,
    modalFormProps,
    onOpenChange,
    disabled,
  } = props;
  const [form] = Form.useForm();
  const intl = useIntl();
  const startRef = useRef(null);
  const aRef = useAddTaskAnimation(startRef);

  const onOk = useMemoizedFn(async () => {
    try {
      const formVal = await form.validateFields();
      return onSubmit?.(formVal).then(() => {
        aRef.running();
        message.success(
          intl.formatMessage(
            { id: 'oprSuc' },
            { name: intl.formatMessage({ id: 'export' }) },
          ),
        );
        return true;
      });
    } catch (e) {
      console.error(e);
    }
  });

  return (
    <TzModalForm
      form={form}
      width={560}
      title={intl.formatMessage({ id: 'export' })}
      {...modalFormProps}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
      }}
      trigger={
        renderTrigger ?? (
          <TzButton disabled={disabled}>
            {intl.formatMessage({ id: 'export' })}
          </TzButton>
        )
      }
      onOpenChange={(o) => {
        setTimeout(() => {
          o && aRef.refreshMount(startRef.current!);
        });
        onOpenChange?.(o, form);
      }}
      onFinish={onOk}
      submitter={{
        searchConfig: {
          resetText: intl.formatMessage({ id: 'cancel' }),
          submitText: intl.formatMessage({ id: 'export' }),
        },
      }}
    >
      {!!tip && <InfoAlert className="mb-3" tip={tip} />}
      {props.formItem}
      <ProFormText
        rules={[
          {
            required: true,
            message: intl.formatMessage(
              { id: 'requiredTips' },
              { name: intl.formatMessage({ id: 'fileName' }) },
            ),
          },
          {
            pattern: /^[^\x20!——@#$%^&*()?<>\[\]:./\\]+$/,
            message: intl.formatMessage({ id: 'unStand.specialSymbols1' }),
          },
        ]}
        fieldProps={{
          maxLength: 200,
          count: {
            show: true,
            max: 200,
          },
        }}
        label={intl.formatMessage({ id: 'fileName' })}
        name="file_name"
        placeholder={intl.formatMessage(
          { id: 'txtTips' },
          { name: intl.formatMessage({ id: 'fileName' }) },
        )}
      />
      <span className="absolute right-8 bottom-6" ref={startRef} />
    </TzModalForm>
  );
};
export default ExportModal;
