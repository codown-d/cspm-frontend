import { storage } from '@/utils/tzStorage';
import { setLocale, useIntl } from '@umijs/max';
import { createIntl, createIntlCache } from 'react-intl';
import locale, { EN_LANG, ZH_LANG } from '.';

const cache = createIntlCache();
const l = storage.getCookie('lang');
const defaultlang = 'en' === l ? EN_LANG : ZH_LANG;
let int = createIntl(
  {
    locale: defaultlang,
    messages: locale[defaultlang?.replace('-', '')],
  },
  cache,
);

export function changeLanguage(lang: string, refresh?: boolean) {
  storage.set('local', lang);
  storage.setCookie('lang', lang === EN_LANG ? 'en' : 'zh');
  setLocale(lang, refresh);
}

const translate = (id: string, values?: {}) => {
  return int.formatMessage({ id }, values);
};

export const useTranslate = () => {
  const _intl = useIntl();
  return (id: string, val?: any) => _intl.formatMessage({ id }, val);
};

export default translate;
