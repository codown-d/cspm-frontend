import InfoAlert from '@/components/InfoAlert';
import { TzInput } from '@/components/lib/TzInput';
import { TzButton } from '@/components/lib/tz-button';
import { TzForm } from '@/components/lib/tz-form';
import { TzModal, TzModalProps } from '@/components/lib/tzModal';
import translate from '@/locales/translate';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Form, Radio, message } from 'antd';
import dayjs from 'dayjs';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useImmer } from 'use-immer';
import useAddTaskAnimation from '../AddTaskAnimation';
import './index.less';

interface IForm {
  fileName: string;
  format: 'PDF' | 'Excel';
}
interface IProps extends TzModalProps {
  tip?: string;
  hasFormat?: boolean;
  formItem?: React.ReactNode;
  defaultValue?: Partial<IForm>;
  onSubmit?: (formValue: Record<string, any>) => Promise<any | undefined>;
}
export interface IRef {
  form: any;
  open: () => void;
}
const DefaultProps: Partial<IProps> = {
  title: translate('export'),
};

export const getExportNameTimeSuffix = () =>
  dayjs().format('YYYYMMDDHHmmssSSS');

export const ExportModal = forwardRef<IRef, IProps>((props, ref) => {
  const { tip, hasFormat, defaultValue, onSubmit, ...modalProps } = {
    ...DefaultProps,
    ...props,
  };
  const intl = useIntl();
  const startRef = useRef(null);
  const aRef = useAddTaskAnimation(startRef);
  const [modalState, setModal] = useImmer<TzModalProps>({
    open: false,
  });
  const [formIns] = Form.useForm();

  useImperativeHandle(ref, () => {
    return {
      form: formIns,
      open() {
        setTimeout(() => {
          aRef.refreshMount(startRef.current!);
        }, 1000);
        setModal((draft) => {
          formIns.resetFields();
          formIns.setFieldsValue(defaultValue);
          draft.open = true;
        });
      },
    };
  });

  const onCancel = useMemoizedFn(() => {
    setModal((draft) => {
      draft.open = false;
    });
  });

  const onOk = useMemoizedFn(async () => {
    try {
      const formVal: IForm = await formIns.validateFields();
      onSubmit?.(formVal).then(() => {
        onCancel();
        aRef.running();
        message.success(
          translate('oprSuc', {
            name: translate('export'),
          }),
        );
      });
    } catch (e) {
      console.error(e);
    }
  });
  return (
    <TzModal
      {...modalProps}
      {...modalState}
      footer={[
        <TzButton className="cancel-btn" key="cancel" onClick={onCancel}>
          {intl.formatMessage({ id: 'cancel' })}
        </TzButton>,
        <TzButton key="submit" type="primary" onClick={onOk} ref={startRef}>
          <span>{translate('export')}</span>
        </TzButton>,
      ]}
      className={'export-modal-wrap'}
      onCancel={onCancel}
      onOk={onOk}
    >
      {!!tip && <InfoAlert className="mb-4 -mt-[11px]" tip={tip} />}
      <TzForm
        layout="vertical"
        autoComplete="off"
        form={formIns}
        onValuesChange={(field) => {}}
      >
        {props.formItem}
        <Form.Item
          required
          label={translate('fileName')}
          name={'fileName'}
          rules={[
            {
              required: true,
              whitespace: true,
              message: translate('requiredTips', {
                name: translate('fileName'),
              }),
            },
            {
              type: 'string',
              max: 50,
              message: translate('maxLengthTips', {
                name: translate('name'),
                len: 50,
              }),
            },
            {
              pattern: /^[^!@#$%^&*()?<>\[\]:./\\]+$/,
              message: translate('unStand.specialSymbols1'),
            },
          ]}
        >
          <TzInput maxLength={50} allowClear />
        </Form.Item>

        {hasFormat && (
          <Form.Item
            required
            label={translate('reportFormat')}
            name={'format'}
            rules={[
              {
                required: true,
                message: translate('requiredTips', {
                  name: translate('reportFormat'),
                }),
              },
            ]}
          >
            <Radio.Group>
              <Radio value={'PDF'}>{'PDF'}</Radio>
              <Radio value={'Excel'}>{'Excel'}</Radio>
            </Radio.Group>
          </Form.Item>
        )}
      </TzForm>
    </TzModal>
  );
});
