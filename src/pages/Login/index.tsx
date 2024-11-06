import RestPwdPopup from '@/components/ResetPwd';
import { TzInput } from '@/components/lib/TzInput';
import { TzButton } from '@/components/lib/tz-button';
import { TzTooltip } from '@/components/lib/tz-tooltip';
import TzLayoutContext from '@/contexts/TzLayoutContext';
import { EN_LANG } from '@/locales';
import {
  getAuthLicense,
  getCaptcha,
  login,
} from '@/services/cspm/UserController';
import { PUBLIC_URL, REACT_APP_SUBJECT } from '@/utils';
import { storage } from '@/utils/tzStorage';
import { getLocale, history, useIntl, useModel } from '@umijs/max';
import { useMemoizedFn, useMount } from 'ahooks';
import { Divider, Form, message } from 'antd';
import modal from 'antd/lib/modal';
import notification from 'antd/lib/notification';
import classNames from 'classnames';
import { keys, uniqueId } from 'lodash';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import LanguageSwitch from './LanguageSwitch';
import LogoLottie from './LogoLottie';
import './index.less';

function LoginScreen() {
  const [captchaData, setCaptchaData] = useState<API.CaptchaResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLicense, setShowLicense] = useState<boolean>(false);
  const [resetPwd, setResetPwd] = useState(false);
  const [loginForm] = Form.useForm();
  const captchaIDRef = useRef<string>();
  const intl = useIntl();
  const { setOpen } = useModel('aiGptModel');
  const [userInfoBuff, setUserInfo] = useState<any>(null);

  const { signin } = useContext(TzLayoutContext);
  useMount(() => {
    // 登出后关掉所有弹出层并清空用户信息
    setOpen(false);
    storage.remove('userInfo');
    // storage.clearCookie();
    storage.removeCookie('token');
  });

  const fetchCodeID = useMemoizedFn(() => {
    captchaIDRef.current = uniqueId('captchaID');
    getCaptcha().then(setCaptchaData);
  });

  const validateAuth = useMemoizedFn(async () => {
    const { valid } = await getAuthLicense();
    if (!valid) {
      setShowLicense(true);
      return;
    }
    setShowLicense(false);
    fetchCodeID();
  });
  useEffect(() => {
    notification.destroy();
    modal.destroyAll();
    fetchCodeID();
    // validateAuth();
  }, []);

  const validateInput = (formData: Record<string, string>) => {
    const m: Record<string, string> = {
      account: intl.formatMessage({ id: 'account' }),
      password: intl.formatMessage({ id: 'password' }),
      captcha_value: intl.formatMessage({ id: 'captcha' }),
    };
    return keys(formData).every((key: string) => {
      if (!formData[key]) {
        message.error(intl.formatMessage({ id: 'txtTips' }, { name: m[key] }));
        return false;
      }
      return true;
    });
  };

  const onLogin = useMemoizedFn((_userInfo) => {
    setResetPwd(false);
    signin(_userInfo, () => {
      // const searchParamsRes = getSearchParams(searchParams);
      // history.replace(searchParamsRes?.redirect ?? '/');
      // 首次进入系统后的默认页面
      history.replace('/');
    });
  });

  const onSubmit = useMemoizedFn((formValues) => {
    if (!validateInput(formValues)) {
      return;
    }
    setIsLoading(true);
    const { password, account, ...rest } = formValues;
    login({
      ...rest,
      captcha_id: captchaData?.captcha_id,
      username: account.trim(),
      password: password.trim(),
    })
      .then((res: API.LoginResponse) => {
        if (res.must_change_pwd) {
          storage.setCookie('token', res.token);
          // 修改密码
          setUserInfo({ ...res, _oldPs: formValues.password });
          setResetPwd(true);
        } else {
          onLogin(res);
        }
      })
      .catch(() => {
        fetchCodeID();
      })
      .finally(() => setIsLoading(false));
  });

  const loginLogoSrc = useMemo(() => {
    return getLocale() === EN_LANG ? LoginLogoEn : LoginLogo;
  }, []);

  return (
    <div
      className={classNames('login-screen')}
      style={{
        background: `url('${PUBLIC_URL}/images/bg.jpg') no-repeat`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="login-screen-card">
        <div className="login-screen-card-form">
          {REACT_APP_SUBJECT === 'tensor' ? (
            <LogoLottie />
          ) : (
            <div className="flex justify-center mb-[2]">
              <img
                src={loginLogoSrc}
                style={{ maxHeight: '63px' }}
                className="login-logo"
              />
            </div>
          )}
          <div className={classNames('df dfac dfjs type-case noShow')}>
            <Form form={loginForm} onFinish={onSubmit} layout="vertical">
              <Form.Item name="account">
                <TzInput
                  placeholder={intl.formatMessage(
                    { id: 'txtTips' },
                    { name: intl.formatMessage({ id: 'account' }) },
                  )}
                />
              </Form.Item>
              <Form.Item name="password">
                <TzInput.Password
                  placeholder={intl.formatMessage(
                    { id: 'txtTips' },
                    { name: intl.formatMessage({ id: 'password' }) },
                  )}
                />
              </Form.Item>

              <div
                className={'flex-r'}
                style={{ justifyContent: 'space-between' }}
              >
                <div style={{ flex: '1', width: '0' }}>
                  <Form.Item
                    name="captcha_value"
                    style={{ marginBottom: '0px' }}
                  >
                    <TzInput
                      autoComplete="off"
                      placeholder={intl.formatMessage(
                        { id: 'captcha' },
                        { name: intl.formatMessage({ id: 'captcha' }) },
                      )}
                    />
                  </Form.Item>
                </div>
                <div className="captcha-input" onClick={fetchCodeID}>
                  {captchaData?.image ? (
                    <img
                      className="w-full h-7"
                      src={captchaData.image}
                      alt=""
                    />
                  ) : (
                    <p className="code-txt flex-c">
                      <span>{intl.formatMessage({ id: 'failToGet' })}</span>
                      <span>
                        {intl.formatMessage({ id: 'unStand.refreshTip' })}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <span className="forget">
                <TzTooltip
                  title={intl.formatMessage({ id: 'unStand.forgetPwdTip' })}
                >
                  {intl.formatMessage({ id: 'forgetPwd' })}
                </TzTooltip>
              </span>
              <TzButton
                type="primary"
                htmlType="submit"
                style={{ width: '100%' }}
              >
                {intl.formatMessage({ id: isLoading ? 'logining' : 'login' })}
              </TzButton>
            </Form>
          </div>
          <LanguageSwitch />
        </div>
        <div className="mt-8">
          <Divider style={{ borderColor: '#8E97A3', height: 20 }}>
            <span className="text-xs text-[#B3BAC6]">
              {intl.formatMessage({ id: 'otherLoginMethods' })}
            </span>
          </Divider>
          <div className="w-[30px] h-[30px] flex items-center justify-center m-auto text-center text-xs rounded-[50%] bg-white">
            <img
              onClick={() =>
                (window.location.href = `${location.origin}/api/v1/auth/oidc/auth?state=oidc`)
              }
              className="cursor-pointer size-[82%]"
              src={`${PUBLIC_URL}/images/azure.png`}
            />
          </div>
          <div className="text-xs text-center text-[#E7E9ED] mt-1">
            <span>Azure</span>
          </div>
        </div>
      </div>

      <RestPwdPopup
        forceChange
        needOld={false}
        oldPs={userInfoBuff?._oldPs}
        open={resetPwd}
        onSuccess={() => onLogin(userInfoBuff)}
        onCancel={() => setResetPwd(false)}
      />
      {/*
      {showLicense && (
        <LicenseModal
          onCancel={() => setShowLicense(false)}
          isActive
          open={showLicense}
        />
      )}
      */}
    </div>
  );
}

export default LoginScreen;
