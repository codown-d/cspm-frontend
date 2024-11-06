import TzProForm from '@/components/lib/ProComponents/TzProForm';
import { TzCard } from '@/components/lib/tz-card';
import {
  ProFormDigit,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Form, FormInstance } from 'antd';

import classNames from 'classnames';
import { useRef, useState } from 'react';
import styles from '../index.less';

type IBasicInfo = {
  form: FormInstance;
  disabledName?: boolean;
  hanleFormChange?: () => void;
};
function EditBasicInfo({ form, disabledName, hanleFormChange }: IBasicInfo) {
  const intl = useIntl();
  const [infoErrors, setInfoErrors] = useState<string[]>();
  const formValueIsChanged = useRef<boolean>(false);

  const name = Form.useWatch(['name'], form);
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const pattern = /^[\u4e00-\u9fa5a-zA-Z0-9-_]+$/;
    const c = value.slice(-1);
    if (pattern.test(c) || pattern.test(value) || value === '') {
      //   setInputValue(value);
      form.setFieldValue('name', value);
    } else {
      form.setFieldValue('name', name);
    }
  };

  return (
    <TzCard
      headStyle={{ paddingBottom: 0 }}
      bodyStyle={{ paddingBlock: '4px 0' }}
      className={classNames({ [styles.hasError]: !!infoErrors?.length })}
      title={
        <span className={styles.errorInfo}>
          {intl.formatMessage({ id: 'basicInfo' })}
          {infoErrors?.length ? (
            <span className={styles.errorInfoTxt}>
              <i>*</i>
              {infoErrors.includes('name') &&
                intl.formatMessage({ id: 'frameworkName' })}
              {infoErrors?.length === 2 && intl.formatMessage({ id: 'and' })}
              {infoErrors.includes('sequence') &&
                intl.formatMessage({ id: 'number' })}
              {intl.formatMessage({ id: 'requiredTips' }, { name: '' })}
            </span>
          ) : null}
        </span>
      }
    >
      <TzProForm
        onValuesChange={(v) => hanleFormChange?.()}
        onFieldsChange={(_, all) => {
          setInfoErrors(
            all.filter((item) => !!item.errors?.length).map((v) => v.name?.[0]),
          );
        }}
        form={form}
        submitter={false}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '',
            },
          ]}
          disabled={disabledName}
          fieldProps={{
            count: {
              show: true,
              max: 50,
            },
            maxLength: 50,
            onChange: handleNameChange,
          }}
          name="name"
          label={intl.formatMessage({ id: 'frameworkName' })}
          placeholder={intl.formatMessage(
            { id: 'unStand.frameworkNameTip' },
            {
              extra: intl.formatMessage(
                { id: 'txtTips' },
                { name: `${intl.formatMessage({ id: 'frameworkName' })} , ` },
              ),
            },
          )}
        />
        <ProFormSwitch
          formItemProps={{ className: styles.statusItem }}
          style={{ minHeight: 18 }}
          fieldProps={{ size: 'small', style: { minHeight: 18 } }}
          required
          name="status"
          initialValue={false}
          label={intl.formatMessage({ id: 'status' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage(
                { id: 'requiredTips' },
                { name: intl.formatMessage({ id: 'status' }) },
              ),
            },
          ]}
        />
        <ProFormDigit
          initialValue={1}
          width={140}
          required
          label={intl.formatMessage({ id: 'number' })}
          name="sequence"
          fieldProps={{ precision: 0 }}
          rules={[
            {
              required: true,
              message: '',
            },
          ]}
        />
      </TzProForm>
    </TzCard>
  );
}

export default EditBasicInfo;
