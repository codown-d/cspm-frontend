import { PwdStrengthLabel } from '@/components/PwdStrengthBar';
import {
  editPwd,
  getManageConf,
  resetPwd,
} from '@/services/cspm/UserController';
import {
  calculatePsStrength,
  getPwdLevelLabel,
  pwdIsMeetStrength,
  pwdReg,
} from '@/utils/password';
import { ProFormText } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { Form, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import TzModalForm from '../lib/ProComponents/TzModalForm';

type TRestPwdPopup = {
  open: boolean;
  isReset?: boolean;
  forceChange?: boolean; // 登录时强制修改密码
  needOld?: boolean;
  id?: string;
  oldPs?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
};

const RestPwdPopup = (props: TRestPwdPopup) => {
  const {
    isReset,
    open,
    onCancel,
    id,
    forceChange,
    oldPs,
    onSuccess,
    needOld = true,
  } = props;
  const [form] = Form.useForm();
  const intl = useIntl();
  const [loginConf, setLoginConf] = useState<API.IManageConf>(null as any);
  const [strength, setStrength] = useState(-1);
  const getStr = useMemoizedFn((id, name?) =>
    intl.formatMessage({ id }, { name }),
  );

  const {
    title,
    submitText,
    sucTip,
    resetText,
    oldPwdStr,
    newPwdStr,
    comfirmPwdStr,
  } = useMemo(() => {
    let submitText, sucTip, title;
    const sucStr = intl.formatMessage({ id: 'success' });
    const oldPwdStr = intl.formatMessage({ id: 'pwdModal.oldPwd' });
    const newPwdStr = intl.formatMessage({ id: 'pwdModal.newPwd' });
    const comfirmPwdStr = intl.formatMessage({ id: 'pwdModal.confirmPwd' });
    if (isReset) {
      submitText = intl.formatMessage({ id: 'reset' });
      sucTip = getStr('pwdModal.resetPwd', sucStr);
      title = getStr('pwdModal.resetPwd', '');
    } else {
      submitText = intl.formatMessage({ id: 'save' });
      sucTip = getStr('pwdModal.updatePwd', sucStr);
      title = getStr('pwdModal.updatePwd', '');
    }
    const resetText = intl.formatMessage({ id: 'cancel' });
    return {
      title,
      submitText,
      sucTip,
      resetText,
      oldPwdStr,
      newPwdStr,
      comfirmPwdStr,
    };
  }, [isReset]);

  useEffect(() => {
    open &&
      getManageConf().then((res) => {
        setLoginConf(res.data);
      });
  }, [open]);

  return (
    <TzModalForm
      form={form}
      width={560}
      title={title}
      open={open}
      submitter={{
        searchConfig: {
          submitText,
          resetText,
        },
        resetButtonProps: {
          className: forceChange ? 'hidden' : 'cancel-btn',
        },
      }}
      modalProps={{ onCancel, wrapClassName: 'u-pwd', destroyOnClose: true }}
      onFinish={async (val) => {
        try {
          const { reNew } = val as { old: string; reNew: string };
          if (isReset) {
            if (!id) {
              console.error('重置密码时缺少 id 参数');
              return false;
            }
            await resetPwd({
              uid: id,
              password: reNew,
            });
          } else {
            const req: API.EditPwdRequest = {
              old_password: val.old,
              new_password: reNew,
            };
            if (forceChange) {
              req.old_password = oldPs!;
            }
            const res = await editPwd(req);
            !res && onSuccess?.();
          }
          message.success(sucTip);
          onCancel?.();
          return true;
        } catch (e) {
          console.error(e);
          return false;
        }
      }}
      onValuesChange={(field) => {
        if (Object.hasOwn(field, 'new')) {
          setStrength(calculatePsStrength(field.new));
        }
      }}
    >
      {needOld && (
        <ProFormText.Password
          name="old"
          label={oldPwdStr}
          placeholder={getStr('txtTips', oldPwdStr)}
          allowClear
          rules={[
            {
              required: true,
              message: getStr('requiredTips', oldPwdStr),
            },
          ]}
        />
      )}
      <div className={'hide-label-after'}>
        <ProFormText.Password
          colon={false}
          name="new"
          label={<PwdStrengthLabel label={newPwdStr} strength={strength} />}
          placeholder={getStr('txtTips', newPwdStr)}
          allowClear
          rules={[
            {
              required: true,
              validator(rule, value) {
                if (!value) {
                  return Promise.reject(getStr('requiredTips', newPwdStr));
                }
                if (!pwdReg(value)) {
                  return Promise.reject(getStr('unStand.pwdRegErrorTip'));
                }
                if (loginConf?.password_rating) {
                  if (pwdIsMeetStrength(value, loginConf.password_rating)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    getStr(
                      'insufficientPwdStrength',
                      getPwdLevelLabel(loginConf.password_rating, false),
                    ),
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        />
      </div>
      <ProFormText.Password
        name="reNew"
        label={comfirmPwdStr}
        placeholder={getStr('txtTips', comfirmPwdStr)}
        allowClear
        rules={[
          {
            required: true,
            message: getStr('requiredTips', comfirmPwdStr),
          },
          {
            message: getStr('unStand.pwdInconsistency'),
            validator(rule, value) {
              return value === form.getFieldValue('new') || !value
                ? Promise.resolve()
                : Promise.reject();
            },
          },
        ]}
      />
    </TzModalForm>
  );
};
export default RestPwdPopup;
