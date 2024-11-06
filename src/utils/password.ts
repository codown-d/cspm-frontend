import translate from '@/locales/translate';
import { sortBy } from 'lodash';
import { getLocale } from '@@/exports';
import { ZH_LANG } from '@/locales';

export const PasswordStrengthList = ['week', 'moderate', 'strong', 'veryStrong'];
export type IPasswordStrength = (typeof PasswordStrengthList)[number];
type TLevel = {
  label: string;
  value: IPasswordStrength;
  class: string;
};

export const PWD_LEVEL: TLevel[] = [
  { value: PasswordStrengthList[0], label: translate('week'), class: 'weak' },
  { value: PasswordStrengthList[1], label: translate('general'), class: 'general' },
  { value: PasswordStrengthList[2], label: translate('strong'), class: 'strong' },
  { value: PasswordStrengthList[3], label: translate('veryStrong'), class: 'veryStrong' },
];

export const getPwdLevelLabel = (val: string | undefined, modified = true) => {
  if (!val) {
    return '';
  }
  const _lab = PWD_LEVEL.find((v) => v.value === val)?.label;
  if (!_lab) {
    return _lab;
  }
  if (!modified) {
    return _lab;
  }
  const isZh = getLocale() === ZH_LANG;
  const AndAbove = isZh ? translate('and_above') : '>= ';
  return isZh ? `${_lab}${AndAbove}` : `${AndAbove} ${_lab}`;
};

// 不再需要检验密码组合，只校是否字符
export function pwdReg(text: string) {
  return !/[^\w~!@$%^&*.]/.test(text);
  // const reg = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[~!@#$%^&*.]).{8,16}$/;
  // const reg1 = /^(?=.*[0-9])(?=.*[~!@#$%^&*.]).{8,16}$/;
  // const reg2 = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,16}$/;
  // const reg3 = /^(?=.*[a-zA-Z])(?=.*[~!@#$%^&*.]).{8,16}$/;
  // return (
  //   reg.test(text) || reg1.test(text) || reg2.test(text) || reg3.test(text)
  // );
}

export function pwdIsMeetStrength(ps: string, strength: string): boolean {
  const target = PasswordStrengthList.indexOf(strength);
  if (target === -1) {
    return false;
  }
  return calculatePsStrength(ps) >= target;
}

export function calculatePsStrength(pwd: string): number {
  const _val = pwd?.trim();
  let newStrength = 0;
  if (!_val) {
    newStrength = -1;
  } else {
    const score = calculatePasswordStrength(_val);
    if (score <= 50) {
      newStrength = 0;
    } else if (score <= 60) {
      newStrength = 1;
    } else if (score <= 80) {
      newStrength = 2;
    } else {
      newStrength = 3;
    }
  }
  return newStrength;
}

// 计算密码强度
export function calculatePasswordStrength(str: string) {
  const password = sortBy(str).join('');
  let score = 0;

  // 密码长度
  if (password.length <= 4) {
    score += 0;
  } else if (password.length >= 5 && password.length <= 8) {
    score += 10;
  } else {
    score += 20;
  }

  // 字母
  if (/[A-Za-z]/.test(password)) {
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
      score += 20;
    } else {
      score += 10;
    }
  }

  // 数字
  if (/\d/.test(password)) {
    if (password.replace(/\D/g, '').length <= 2) {
      score += 10;
    } else {
      score += 15;
    }
  }

  // 符号
  if (/[\W_]/.test(password)) {
    if (password.replace(/[\w\s]/g, '').length === 1) {
      score += 10;
    } else {
      score += 20;
    }
  }

  // 字符重复
  if (/(\w)\1+/.test(password)) {
    score += 5;
  } else {
    score += 10;
  }

  // 整体
  if (
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[\W_]/.test(password)
  ) {
    score += 15;
  } else if (
    /[a-zA-Z]/.test(password) &&
    /\d/.test(password) &&
    /[\W_]/.test(password)
  ) {
    score += 10;
  } else if (
    /[a-zA-Z]/.test(password) &&
    /\d/.test(password) &&
    !/[\W_]/.test(password)
  ) {
    score += 5;
  }

  return score;
}
