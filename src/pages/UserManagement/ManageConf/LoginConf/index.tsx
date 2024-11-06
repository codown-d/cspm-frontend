import TzSelectTag from '@/components/lib/TzTagSelect';
import { TzButton } from '@/components/lib/tz-button';
import { TzCard } from '@/components/lib/tz-card';
import { MyFormItem, TzForm, TzFormItem } from '@/components/lib/tz-form';
import { TzInputNumber } from '@/components/lib/tz-input-number';
import { TzSwitch } from '@/components/lib/tz-switch';
import { RenderTag } from '@/components/lib/tz-tag';
import TzSelect from '@/components/lib/tzSelect';
import { ZH_LANG } from '@/locales';
import ConfigItem from '@/pages/components/ConfigItem';
import { getManageConf, setManageConf } from '@/services/cspm/UserController';
import {
  IPasswordStrength,
  PWD_LEVEL,
  getPwdLevelLabel,
} from '@/utils/password';
import { getLocale, useIntl, useModel } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { message } from 'antd';
import Form from 'antd/lib/form';
import { cloneDeep } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import './index.less';

interface IForm {
  cycleDay: number;
  rateLimitThreshold: number;
  firstLoginChangePwd: boolean;
  resetLoginChangePwd: boolean;
  cycleChangePwd: boolean;
  rateLimitEnable: boolean;
  PwdSecurityLevel: IPasswordStrength;
  mfaVerityLogin: boolean;
  iPBlackList: string[];
}

const ManageConf = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [formIns] = Form.useForm();
  const [loginInfo, setLoginInfo] = useState<IForm>({} as any);
  const intl = useIntl();
  const translate = useMemoizedFn((id, val?: any) =>
    intl.formatMessage({ id }, val),
  );
  const isZh = getLocale() === ZH_LANG;

  const fetchConfigLogin = useMemoizedFn(async () => {
    const { data } = await getManageConf();
    const formVal = {
      cycleDay: data.cycle_day || 90,
      rateLimitThreshold: data.account_lock_threshold || 5,
      firstLoginChangePwd: data.fl_pwd_change,
      resetLoginChangePwd: data.reset_fl_pwd_change,
      cycleChangePwd: data.cycle_pwd_change,
      rateLimitEnable: data.account_lock,
      PwdSecurityLevel: data.password_rating,
      mfaVerityLogin: data.mfa,
      iPBlackList: data.ip_block,
    };
    setLoginInfo(formVal);
    formIns.setFieldsValue(formVal);
  });
  useEffect(() => {
    fetchConfigLogin();
  }, []);
  const { getTagInfo } = useModel('global') ?? {};

  const RoleIsNormal = useMemo(() => {
    // let user = getUserInformation();
    // return user.role === 'normal';
    return false;
  }, []);

  let cycleChangePwd = Form.useWatch('cycleChangePwd', formIns);
  let rateLimitEnable = Form.useWatch('rateLimitEnable', formIns);
  if (!isEdit) {
    cycleChangePwd = loginInfo.cycleChangePwd;
    rateLimitEnable = loginInfo.rateLimitEnable;
  }

  const pwdLevelOptions = useMemo(() => {
    return cloneDeep(PWD_LEVEL)
      .reverse()
      .map((item) => ({
        ...item,
        label: getPwdLevelLabel(item.value),
      }));
  }, []);

  const onSave = useMemoizedFn(() => {
    formIns?.validateFields().then(async (value: IForm) => {
      const req = {
        cycle_day: value.cycleDay,
        account_lock_threshold: value.rateLimitThreshold,
        fl_pwd_change: value.firstLoginChangePwd,
        reset_fl_pwd_change: value.resetLoginChangePwd,
        cycle_pwd_change: value.cycleChangePwd,
        account_lock: value.rateLimitEnable,
        password_rating: value.PwdSecurityLevel,
        mfa: value.mfaVerityLogin,
        ip_block: value.iPBlackList,
      };
      const res = await setManageConf(req as any);
      if (res?.error) {
        return;
      }
      message.success(translate('saveSuccess'));
      setIsEdit(false);
      fetchConfigLogin();
    });
  });

  return (
    <div className="login-config mt-1">
      <TzCard
        title={
          <>
            {translate('loginConfiguration')}
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
                      formIns.setFieldsValue(loginInfo);
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
          padding: '0 16px 16px',
        }}
      >
        <TzForm form={formIns}>
          <ConfigItem
            t={translate('unStand.forcePasswordChangeonfirstLogin')}
            desc={translate('unStand.forceChangePwdTip')}
            isEdit={isEdit}
            previewNode={
              <RenderTag
                closeIcon={false}
                type={loginInfo?.firstLoginChangePwd ? 'open' : 'closed'}
              />
            }
            // previewNode={renderCommonStatusTag({
            //   getTagInfoByStatus: () =>
            //     getTagInfo(
            //       configEnum,
            //       loginInfo?.firstLoginChangePwd ? 'open' : 'closed',
            //       CONFIG_STATUS_MAP,
            //     ),
            //   status: loginInfo?.firstLoginChangePwd ? 'open' : 'closed',
            // })}
            editNode={
              <TzFormItem
                noStyle
                name="firstLoginChangePwd"
                valuePropName="checked"
              >
                <TzSwitch
                  checkedChildren={translate('switch.open')}
                  unCheckedChildren={translate('switch.close')}
                />
              </TzFormItem>
            }
          />
          <ConfigItem
            t={translate('unStand.forcePasswordChangeAfterReset')}
            desc={translate('unStand.openForceChangePwdTip')}
            isEdit={isEdit}
            previewNode={
              <RenderTag
                closeIcon={false}
                type={loginInfo?.resetLoginChangePwd ? 'open' : 'closed'}
              />
            }
            editNode={
              <TzFormItem
                noStyle
                name="resetLoginChangePwd"
                valuePropName="checked"
              >
                <TzSwitch
                  checkedChildren={translate('switch.open')}
                  unCheckedChildren={translate('switch.close')}
                />
              </TzFormItem>
            }
          />

          <ConfigItem
            t={translate('periodicPasswordChange')}
            desc={translate('unStand.openAccountLockTip')}
            isEdit={isEdit}
            previewNode={
              <RenderTag
                closeIcon={false}
                type={loginInfo?.cycleChangePwd ? 'open' : 'closed'}
              />
            }
            editNode={
              <TzFormItem noStyle name="cycleChangePwd" valuePropName="checked">
                <TzSwitch
                  checkedChildren={translate('switch.open')}
                  unCheckedChildren={translate('switch.close')}
                />
              </TzFormItem>
            }
          />

          {cycleChangePwd && (
            <ConfigItem
              t={translate('loginPasswordChangeIntervalSetting')}
              desc={translate('unStand.cycChangePwdTip')}
              isEdit={isEdit}
              previewNode={
                <span className={'f-r mr16'}>
                  {` ${loginInfo?.cycleDay} ${translate('days')}`}
                </span>
              }
              editNode={
                <MyFormItem
                  noStyle
                  name="cycleDay"
                  render={(children) => (
                    <div className={'my-form-item-children'}>
                      {children}
                      <span style={{ paddingRight: '11px' }}>
                        {translate('daily')}
                      </span>
                    </div>
                  )}
                >
                  <TzInputNumber
                    style={{ width: '115px' }}
                    parser={(value: any) => parseInt(value) || 90}
                    bordered={false}
                    min={1}
                    max={9999}
                    controls={false}
                    defaultValue={90}
                  />
                </MyFormItem>
              }
            />
          )}

          <ConfigItem
            style={{ marginBottom: 0 }}
            t={translate('accountLockingMechanism')}
            desc={translate('unStand.openPwsErrorCountTip')}
            isEdit={isEdit}
            previewNode={
              <RenderTag
                closeIcon={false}
                type={loginInfo?.rateLimitEnable ? 'open' : 'closed'}
              />
            }
            editNode={
              <TzFormItem
                noStyle
                name="rateLimitEnable"
                valuePropName="checked"
                hidden={!isEdit}
              >
                <TzSwitch
                  checkedChildren={translate('switch.open')}
                  unCheckedChildren={translate('switch.close')}
                />
              </TzFormItem>
            }
          />

          {rateLimitEnable && (
            <ConfigItem
              style={{ marginBottom: '0', marginTop: 12 }}
              t={translate('unStand.pwdErrorCountConfTip')}
              desc={translate('unStand.errorLoginErrorCountNote')}
              isEdit={isEdit}
              previewNode={
                <span className={'f-r mr16'}>
                  {loginInfo?.rateLimitThreshold}&nbsp;{translate('time')}
                </span>
              }
              editNode={
                <MyFormItem
                  noStyle
                  name="rateLimitThreshold"
                  render={(children) => (
                    <div className={'my-form-item-children'}>
                      {children}
                      <span style={{ paddingRight: '11px' }}>
                        {translate('time')}
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
          )}

          <ConfigItem
            style={{ marginBottom: '0', marginTop: 12 }}
            t={translate('userPasswordStrengthConfiguration')}
            desc={translate('unStand.pwdStrengthNote')}
            isEdit={isEdit}
            previewNode={
              <span className={'f-r'}>
                {!loginInfo?.PwdSecurityLevel
                  ? '-'
                  : getPwdLevelLabel(loginInfo?.PwdSecurityLevel)}
              </span>
            }
            editNode={
              <TzFormItem noStyle name="PwdSecurityLevel">
                <TzSelect
                  style={{ width: isZh ? '141px' : '167px' }}
                  options={pwdLevelOptions}
                />
              </TzFormItem>
            }
          />
          {/* <ConfigItem
            style={{ marginBottom: 0, marginTop: 12 }}
            t={translate('unStand.mfaMultiFactorAuthenticationConfiguration')}
            desc={translate('unStand.openMFATip')}
            isEdit={isEdit}
            previewNode={
              <RenderTag
                closeIcon={false}
                type={loginInfo?.mfaVerityLogin ? 'open' : 'closed'}
              />
            }
            editNode={
              <TzFormItem
                noStyle
                name="mfaVerityLogin"
                valuePropName="checked"
                hidden={!isEdit}
              >
                <TzSwitch
                  checkedChildren={translate('switch.open')}
                  unCheckedChildren={translate('switch.close')}
                />
              </TzFormItem>
            }
          /> */}
          <ConfigItem
            vertical
            style={{ marginBottom: '0', marginTop: 12 }}
            t={translate('unStand.loginIPBlacklistConfiguration')}
            desc={translate('unStand.iPblacklistTips')}
            isEdit={isEdit}
            previewNode={
              <div style={{ marginBottom: '-8px' }}>
                {loginInfo?.iPBlackList?.length ? (
                  loginInfo?.iPBlackList?.map((v: string) => (
                    <RenderTag
                      key={v}
                      title={v}
                      type={'open'}
                      className={'mr-2 mb-2'}
                    >
                      {v}
                    </RenderTag>
                  ))
                ) : (
                  <span className="mb8">-</span>
                )}
              </div>
            }
            editNode={
              <TzFormItem
                style={{ marginBottom: 0 }}
                name="iPBlackList"
                className={'mt-4'}
              >
                <TzSelectTag
                  placeholder={translate('unStand.pleaseInputBlacklistedIP')}
                  style={{ width: '100%' }}
                />
              </TzFormItem>
            }
          />
        </TzForm>
      </TzCard>
    </div>
  );
};

export default ManageConf;
