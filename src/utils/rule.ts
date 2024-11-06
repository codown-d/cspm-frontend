import translate from '@/locales/translate';
import { pwdReg } from './password';

// 密码校验规则
export function usePasswordRule() {
  return {
    required: true,
    validator(_: unknown, value: string) {
      if (!value) {
        return Promise.reject(
          translate('requiredTips', { name: translate('password') }),
        );
      }
      return pwdReg(value)
        ? Promise.resolve()
        : Promise.reject(translate('unStand.pwdRegErrorTip'));
    },
  };
}

// 手机号校验规则
export function usePhoneRule() {
  return {
    required: true,
    validator(_: unknown, value: string) {
      if (!value) {
        return Promise.reject(
          translate('requiredTips', { name: translate('phone') }),
        );
      }

      return /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(
        value,
      )
        ? Promise.resolve()
        : Promise.reject(translate('unStand.phoneRegTip'));
    },
  };
}

export function useEmailRule(): any[] {
  return [
    {
      required: true,
      message: translate('requiredTips', { name: translate('mail') }),
    },
    {
      type: 'email',
      message: translate('unStand.mailRegTip'),
    },
  ];
}
