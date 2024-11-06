import { TzButton } from '@/components/lib/tz-button';
import { TzCard } from '@/components/lib/tz-card';
import { MyFormItem, TzForm } from '@/components/lib/tz-form';
import { TzInputNumber } from '@/components/lib/tz-input-number';
import translate from '@/locales/translate';
import ConfigItem from '@/pages/components/ConfigItem';
import {
  getComplianceSettings,
  postComplianceSettings,
} from '@/services/cspm/Compliance';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { message } from 'antd';
import Form from 'antd/lib/form';
import { useEffect, useMemo, useState } from 'react';
import './index.less';

const configEnum = [
  {
    label: translate('switch.open'),
    value: 'open',
  },
  {
    label: translate('switch.close'),
    value: 'closed',
  },
];

const ManageConf = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [formIns] = Form.useForm();
  const [info, seInfo] = useState<API_COMPLIANCE.ComplianceSettingsReq>();
  const intl = useIntl();
  const translate = useMemoizedFn((id, val?: any) =>
    intl.formatMessage({ id }, val),
  );

  const fetchConfigData = useMemoizedFn(async () => {
    const res = await getComplianceSettings();
    seInfo(res);
    formIns.setFieldsValue(res);
  });
  useEffect(() => {
    fetchConfigData();
  }, []);
  const RoleIsNormal = useMemo(() => {
    // let user = getUserInformation();
    // return user.role === 'normal';
    return false;
  }, []);

  const onSave = useMemoizedFn(() => {
    formIns
      ?.validateFields()
      .then(async (value: API_COMPLIANCE.ComplianceSettingsReq) => {
        const res = await postComplianceSettings(value);
        if (res?.error) {
          return;
        }
        message.success(translate('saveSuccess'));
        setIsEdit(false);
        fetchConfigData();
      });
  });

  return (
    <TzCard
      className="mt-1"
      title={
        <>
          {translate('manualCorrection')}
          <div className={'f-r'}>
            {isEdit ? (
              <>
                <TzButton size={'small'} type={'primary'} onClick={onSave}>
                  {translate('save')}
                </TzButton>
                <TzButton
                  size={'small'}
                  className="ml8 cancel-btn"
                  onClick={() => {
                    formIns.setFieldsValue(info);
                    setIsEdit(false);
                  }}
                >
                  {translate('cancel')}
                </TzButton>
              </>
            ) : (
              <TzButton
                size={'small'}
                onClick={() => {
                  setIsEdit(true);
                }}
                disabled={RoleIsNormal}
              >
                {translate('edit')}
              </TzButton>
            )}
          </div>
        </>
      }
      bodyStyle={{
        padding: '0 16px',
      }}
    >
      <TzForm form={formIns}>
        <ConfigItem
          t={translate('unStand.manualCorrectionConfConfig')}
          desc={translate('unStand.manualCorrectionConfTip')}
          isEdit={isEdit}
          previewNode={
            <span className={'f-r mr-2'}>
              {info?.remain ?? '-'}&nbsp;{translate('days')}
            </span>
          }
          editNode={
            <MyFormItem
              noStyle
              name="remain"
              render={(children) => (
                <div className={'my-form-item-children'}>
                  {children}
                  <span style={{ paddingRight: '11px' }}>
                    {translate('days')}
                  </span>
                </div>
              )}
            >
              <TzInputNumber
                style={{ width: '115px' }}
                bordered={false}
                parser={(value: any) => parseInt(value) || 5}
                min={1}
                max={9999}
                controls={false}
                defaultValue={1}
              />
            </MyFormItem>
          }
        />
      </TzForm>
    </TzCard>
  );
};

export default ManageConf;
