import TzModalForm from '@/components/lib/ProComponents/TzModalForm';
import TzTagSelect from '@/components/lib/TzTagSelect';
import { addTag, updateTag } from '@/services/cspm/Tags';
import {
  ProForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Form, message } from 'antd';
import { ReactElement, useMemo } from 'react';
type TTagModal = {
  trigger: ReactElement;
  record?: API_TAG.TagsDatum;
  calFn?: VoidFunction;
};

function TagModal({ trigger, record, calFn }: TTagModal) {
  const intl = useIntl();
  const { initialState } = useModel('@@initialState');

  const [form] = Form.useForm();
  const isEdit = !!record;
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

  const initialValues = useMemo(() => {
    if (!record) {
      return;
    }
    return {
      ...record,
      values: record.values?.map((item) => item.value),
    };
  }, [record]);
  return (
    <TzModalForm
      initialValues={initialValues}
      form={form}
      width={560}
      submitter={{
        searchConfig: {
          submitText: intl.formatMessage({ id: isEdit ? 'save' : 'add' }),
        },
        resetButtonProps: {
          className: 'cancel-btn',
        },
      }}
      onFinish={async (values) => {
        if (isEdit) {
          const originValues = record?.values || [];
          const newData = {
            ...values,
            values: values.values.map((item) => {
              const id = originValues?.find(
                (originItem) => originItem.value === item,
              )?.id;
              return id
                ? {
                    id,
                    value: item,
                  }
                : { value: item };
            }),
          };
          await updateTag(newData as API_TAG.UpdateTagsRequest);
          message.success(intl.formatMessage({ id: 'saveSuccess' }));
        } else {
          await addTag(values as API_TAG.AddTagsRequest);
          message.success(intl.formatMessage({ id: 'newSuccess' }));
        }

        calFn?.();
        return true;
      }}
      modalProps={{ destroyOnClose: true }}
      title={intl.formatMessage(
        { id: isEdit ? 'editWithName' : 'addWithName' },
        {
          name: intl.formatMessage({ id: 'tag' }),
        },
      )}
      trigger={trigger}
    >
      <ProFormText
        disabled={isEdit}
        fieldProps={{
          maxLength: 20,
          count: {
            show: true,
            max: 20,
          },
        }}
        {...getFieldProps('key', 'tagLabel')}
      />
      <ProForm.Item {...getFieldProps('values', 'tagValue', 'select')}>
        <TzTagSelect
          placeholder={intl.formatMessage({
            id: 'unStand.customerTagTip',
          })}
        />
      </ProForm.Item>
      <ProFormTextArea
        {...getFieldProps('desc', 'remark')}
        required={false}
        rules={undefined}
        fieldProps={{
          maxLength: 50,
          count: {
            show: true,
            max: 50,
          },
        }}
        placeholder={intl.formatMessage({
          id: 'unStand.customerTagDescTip',
        })}
      />
    </TzModalForm>
  );
}

export default TagModal;
